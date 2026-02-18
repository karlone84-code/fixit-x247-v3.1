import { test, expect } from '@playwright/test';

test.describe('Cânone Fix.it x247 v3.1 - E2E Prod Validation', () => {
  
  test('Fluxo Crítico: SOS e Pagamento', async ({ page }) => {
    // 1. Login Stealth
    await page.goto('/');
    await page.fill('input[type="email"]', 'founder@fixit.pt');
    await page.fill('input[type="password"]', '050184');
    await page.click('button:has-text("Entrar HQ")');
    
    // 2. Radar SOS
    await page.click('button:has-text("SOS")');
    await page.click('button:has-text("Canalização")');
    await page.fill('textarea', 'Inundação grave na cozinha. Urgente!');
    await page.click('button:has-text("Ativar Radar SOS")');
    
    // 3. Seleção e Alerta Sonoro (SSE Simulation)
    await expect(page.locator('text=Radar Results')).toBeVisible({ timeout: 15000 });
    await page.click('button:has-text("Confirmar Pedido")');
    
    // 4. Chat com Flix (IA Backend)
    await page.click('button:has-text("×"), button:has-text("🤖")'); // Mascote
    await page.fill('input[placeholder="Escreva ao Flix..."]', 'Preciso de ajuda com a fatura');
    await page.click('button:has-text("→")');
    await expect(page.locator('text=Bonito Serviço')).toBeVisible();

    // 5. Pagamento (Stripe Interaction)
    await page.click('button:has-text("Pedidos")');
    await page.click('text=#SOS-');
    await page.click('button:has-text("Confirmar Pagamento")');
    
    // Validar Reconciliação
    await expect(page.locator('text=Pagamento confirmado')).toBeVisible();
  });

});