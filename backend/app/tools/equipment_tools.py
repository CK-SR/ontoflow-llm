from app.config import settings
from app.db import connect


def analyze_equipment_risk(equipment_id: int) -> dict:
    with connect(settings.equipment_db) as conn:
        eq = conn.execute("SELECT * FROM equipment WHERE id=?", (equipment_id,)).fetchone()
        if not eq:
            raise ValueError("设备不存在")
        supplier = conn.execute("SELECT * FROM supplier WHERE id=?", (eq['supplier_id'],)).fetchone()
        ms = conn.execute("SELECT * FROM maintenance_record WHERE equipment_id=?", (equipment_id,)).fetchall()
    score, reasons = 0, []
    if eq['status'] == '异常': score += 30; reasons.append('status=异常 +30')
    if eq['status'] == '维修中': score += 20; reasons.append('status=维修中 +20')
    if eq['importance_level'] == '关键': score += 20; reasons.append('importance=关键 +20')
    if len(ms) >= 3: score += 20; reasons.append('维修记录>=3 +20')
    if any(m['severity'] == '高' for m in ms): score += 15; reasons.append('存在高严重度维修 +15')
    if supplier and supplier['risk_level'] == '高': score += 20; reasons.append('供应商风险高 +20')
    elif supplier and supplier['risk_level'] == '中': score += 10; reasons.append('供应商风险中 +10')
    level = '高' if score >= 70 else ('中' if score >= 40 else '低')
    return {"equipment_id": eq['id'], "equipment_name": eq['name'], "risk_score": min(score,100), "risk_level": level,
            "reasons": reasons, "related_supplier": supplier['name'] if supplier else None, "maintenance_count": len(ms)}
