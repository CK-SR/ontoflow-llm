from __future__ import annotations

import json
import sqlite3
from pathlib import Path

from app.config import settings


def init_demo_databases() -> None:
    """Create/reset demo business DB and platform DB with seed data."""
    settings.data_dir.mkdir(exist_ok=True)
    _init_equipment_db(settings.equipment_db)
    _init_platform_db(settings.platform_db, settings.equipment_db)


def build_graph() -> None:
    """Rebuild graph_nodes and graph_edges from equipment DB."""
    with sqlite3.connect(settings.equipment_db) as src, sqlite3.connect(settings.platform_db) as dst:
        src.row_factory = sqlite3.Row
        dst.row_factory = sqlite3.Row
        dst.execute("DELETE FROM graph_edges")
        dst.execute("DELETE FROM graph_nodes")

        node_map: dict[tuple[str, int], int] = {}

        def load(table: str, entity_type: str, label_col: str = "name") -> None:
            for row in src.execute(f"SELECT * FROM {table}").fetchall():
                label = row[label_col] if label_col in row.keys() else f"{entity_type}-{row['id']}"
                cur = dst.execute(
                    "INSERT INTO graph_nodes(entity_type,source_table,source_id,label,properties_json) VALUES(?,?,?,?,?)",
                    (entity_type, table, row["id"], str(label), json.dumps(dict(row), ensure_ascii=False)),
                )
                node_map[(table, row["id"])] = cur.lastrowid

        load("equipment", "Equipment")
        load("manufacturer", "Manufacturer")
        load("location", "Location")
        load("maintenance_record", "MaintenanceRecord", "id")
        load("supplier", "Supplier")
        load("purchase_contract", "PurchaseContract", "contract_no")

        for e in src.execute("SELECT * FROM equipment"):
            dst.execute(
                "INSERT INTO graph_edges(source_node_id,target_node_id,relation_type,properties_json) VALUES(?,?,?,?)",
                (node_map[("equipment", e["id"])], node_map[("manufacturer", e["manufacturer_id"])], "PRODUCED_BY", "{}"),
            )
            dst.execute(
                "INSERT INTO graph_edges(source_node_id,target_node_id,relation_type,properties_json) VALUES(?,?,?,?)",
                (node_map[("equipment", e["id"])], node_map[("location", e["location_id"])], "LOCATED_IN", "{}"),
            )
            dst.execute(
                "INSERT INTO graph_edges(source_node_id,target_node_id,relation_type,properties_json) VALUES(?,?,?,?)",
                (node_map[("equipment", e["id"])], node_map[("supplier", e["supplier_id"])], "SUPPLIED_BY", "{}"),
            )

        for m in src.execute("SELECT * FROM maintenance_record"):
            dst.execute(
                "INSERT INTO graph_edges(source_node_id,target_node_id,relation_type,properties_json) VALUES(?,?,?,?)",
                (node_map[("equipment", m["equipment_id"])], node_map[("maintenance_record", m["id"])], "HAS_MAINTENANCE", "{}"),
            )

        for c in src.execute("SELECT * FROM purchase_contract"):
            dst.execute(
                "INSERT INTO graph_edges(source_node_id,target_node_id,relation_type,properties_json) VALUES(?,?,?,?)",
                (node_map[("equipment", c["equipment_id"])], node_map[("purchase_contract", c["id"])], "HAS_CONTRACT", "{}"),
            )
            dst.execute(
                "INSERT INTO graph_edges(source_node_id,target_node_id,relation_type,properties_json) VALUES(?,?,?,?)",
                (node_map[("supplier", c["supplier_id"])], node_map[("purchase_contract", c["id"])], "SIGNED_CONTRACT", "{}"),
            )
        dst.commit()


def ensure_runtime_ready() -> None:
    """Auto-create DB files and graph on first startup if missing."""
    if not settings.equipment_db.exists() or not settings.platform_db.exists():
        init_demo_databases()
        build_graph()


def _init_equipment_db(db_path: Path) -> None:
    with sqlite3.connect(db_path) as c:
        c.executescript(
            """
            DROP TABLE IF EXISTS equipment; DROP TABLE IF EXISTS manufacturer; DROP TABLE IF EXISTS location;
            DROP TABLE IF EXISTS maintenance_record; DROP TABLE IF EXISTS purchase_contract; DROP TABLE IF EXISTS supplier;
            CREATE TABLE manufacturer(id INTEGER PRIMARY KEY,name TEXT,qualification_level TEXT,contact TEXT);
            CREATE TABLE supplier(id INTEGER PRIMARY KEY,name TEXT,credit_level TEXT,risk_level TEXT);
            CREATE TABLE location(id INTEGER PRIMARY KEY,name TEXT,type TEXT,parent_id INTEGER);
            CREATE TABLE equipment(id INTEGER PRIMARY KEY,name TEXT,model TEXT,category TEXT,manufacturer_id INTEGER,status TEXT,location_id INTEGER,supplier_id INTEGER,importance_level TEXT);
            CREATE TABLE maintenance_record(id INTEGER PRIMARY KEY,equipment_id INTEGER,fault_desc TEXT,repair_action TEXT,repair_time TEXT,operator TEXT,severity TEXT);
            CREATE TABLE purchase_contract(id INTEGER PRIMARY KEY,equipment_id INTEGER,supplier_id INTEGER,contract_no TEXT,amount REAL,purchase_date TEXT);
            """
        )
        c.executemany("INSERT INTO manufacturer VALUES(?,?,?,?)", [(1, "华北智造", "A", "010-10001"), (2, "深蓝机电", "A", "0755-20002"), (3, "江南传感", "B", "021-30003"), (4, "远航自动化", "B", "020-40004"), (5, "北辰仪表", "C", "010-50005")])
        c.executemany("INSERT INTO supplier VALUES(?,?,?,?)", [(1, "安信供应", "A", "低"), (2, "鸿图贸易", "B", "中"), (3, "启明集采", "C", "高"), (4, "瑞诚工业", "B", "中"), (5, "泽源设备", "A", "低")])
        c.executemany("INSERT INTO location VALUES(?,?,?,?)", [(1, "一号厂房", "工厂", None), (2, "二号厂房", "工厂", None), (3, "A线", "产线", 1), (4, "B线", "产线", 2), (5, "仓储区", "仓库", None)])
        c.executemany("INSERT INTO equipment VALUES(?,?,?,?,?,?,?,?,?)", [(1, "空压机A", "KA-100", "动力", 1, "正常", 3, 1, "关键"), (2, "焊接机器人B", "WB-20", "机器人", 2, "异常", 4, 3, "关键"), (3, "温度传感器C", "TS-9", "传感器", 3, "正常", 3, 2, "一般"), (4, "数控机床D", "NC-500", "机床", 4, "维修中", 4, 4, "关键"), (5, "包装机E", "PK-88", "包装", 5, "异常", 5, 3, "一般"), (6, "AGV小车F", "AGV-3", "物流", 2, "正常", 5, 5, "一般")])
        m = [(1, 2, "焊缝偏移", "重标定", "2026-05-01", "王工", "中"), (2, 2, "伺服报警", "更换驱动器", "2026-05-08", "李工", "高"), (3, 2, "视觉定位失败", "重启视觉系统", "2026-05-12", "赵工", "中"), (4, 4, "主轴过热", "更换轴承", "2026-04-18", "周工", "高"), (5, 4, "刀库卡顿", "润滑维护", "2026-05-10", "周工", "中"), (6, 5, "封口不良", "更换加热条", "2026-05-16", "陈工", "中"), (7, 5, "传送带抖动", "张紧调整", "2026-05-20", "陈工", "低")]
        c.executemany("INSERT INTO maintenance_record VALUES(?,?,?,?,?,?,?)", m)
        c.executemany("INSERT INTO purchase_contract VALUES(?,?,?,?,?,?)", [(1, 1, 1, "HT-2025-001", 120000, "2025-01-15"), (2, 2, 3, "QM-2025-077", 860000, "2025-03-12"), (3, 3, 2, "HT-2025-033", 24000, "2025-02-21"), (4, 4, 4, "RC-2025-009", 530000, "2025-04-03"), (5, 5, 3, "QM-2025-101", 110000, "2025-04-26"), (6, 6, 5, "ZY-2025-015", 90000, "2025-05-11")])
        c.commit()


def _init_platform_db(db_path: Path, equipment_db_path: Path) -> None:
    with sqlite3.connect(db_path) as c:
        c.executescript(
            """
            CREATE TABLE IF NOT EXISTS datasources(id INTEGER PRIMARY KEY,name TEXT,type TEXT,db_path TEXT,description TEXT);
            CREATE TABLE IF NOT EXISTS ontology_schemas(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,schema_json TEXT,created_at TEXT);
            CREATE TABLE IF NOT EXISTS graph_nodes(id INTEGER PRIMARY KEY AUTOINCREMENT,entity_type TEXT,source_table TEXT,source_id INTEGER,label TEXT,properties_json TEXT);
            CREATE TABLE IF NOT EXISTS graph_edges(id INTEGER PRIMARY KEY AUTOINCREMENT,source_node_id INTEGER,target_node_id INTEGER,relation_type TEXT,properties_json TEXT);
            DELETE FROM datasources;
            """
        )
        c.execute(
            "INSERT INTO datasources(id,name,type,db_path,description) VALUES(1,?,?,?,?)",
            ("equipment_demo", "sqlite", str(equipment_db_path), "设备业务演示库"),
        )
        c.commit()
