
from app.domain.payments.models import PaymentSplit, CommissionModel

def calculate_split(total_amount: int, commission_rate: float, model: CommissionModel) -> PaymentSplit:
    """
    Calcula a divisão do valor total entre a plataforma e o profissional.
    Valores processados em cêntimos para evitar erros de floating point.
    """
    platform_amount = int(total_amount * commission_rate)
    pro_amount = total_amount - platform_amount
    
    return PaymentSplit(
        total_amount=total_amount,
        platform_amount=platform_amount,
        pro_amount=pro_amount,
        commission_rate=commission_rate,
        model=model
    )
