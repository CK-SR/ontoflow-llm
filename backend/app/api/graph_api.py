from fastapi import APIRouter
from app.services.graph_query import GraphQueryService
from app.config import settings
from app.db import connect, rows_to_dict
from app.tools.equipment_tools import analyze_equipment_risk

router = APIRouter(prefix="/api", tags=["graph"])
g = GraphQueryService()

@router.get('/graph/stats')
def stats(): return g.stats()
@router.get('/graph/nodes')
def nodes(): return g.list_nodes()
@router.get('/graph/edges')
def edges(): return g.list_edges()
@router.get('/graph/entity/{node_id}')
def entity(node_id:int): return g.get_entity(node_id)
@router.get('/graph/entity/{node_id}/neighbors')
def neighbors(node_id:int): return g.neighbors(node_id)
@router.get('/graph/search')
def search(keyword:str): return g.search(keyword)

@router.get('/equipment')
def equipment():
    with connect(settings.equipment_db) as conn:
        rows = conn.execute(
            'SELECT e.*, '
            'm.name AS manufacturer_name, '
            'l.name AS location_name, '
            's.name AS supplier_name '
            'FROM equipment e '
            'LEFT JOIN manufacturer m ON e.manufacturer_id = m.id '
            'LEFT JOIN location l ON e.location_id = l.id '
            'LEFT JOIN supplier s ON e.supplier_id = s.id '
            'ORDER BY e.id'
        ).fetchall()
        return rows_to_dict(rows)

@router.get('/equipment/risks')
def risks(): return [analyze_equipment_risk(i) for i in range(1,7)]

@router.get('/equipment/{equipment_id}/risk')
def risk(equipment_id:int): return analyze_equipment_risk(equipment_id)
