from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time

def configurar_driver():
    chrome_options = Options()
    chrome_options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    chrome_options.add_argument("--start-maximized")
    chrome_options.add_argument("--incognito")
    return webdriver.Chrome(service=Service(), options=chrome_options)

def digitar_apresentacao(elemento, texto, delay=0.10):
    for letra in texto:
        elemento.send_keys(letra)
        time.sleep(delay)

def destacar(driver, elemento):
    driver.execute_script("arguments[0].style.border='4px solid #5d5fef'", elemento)
    driver.execute_script("arguments[0].style.transition='all 0.4s'", elemento)
    time.sleep(0.8)

def limpar_campo(elemento):
    elemento.send_keys(Keys.CONTROL + "a")
    elemento.send_keys(Keys.BACKSPACE)
    time.sleep(0.5)

def executar_demo_final_com_todos_cts():
    driver = configurar_driver()
    wait = WebDriverWait(driver, 20)
    base_url = "http://localhost:3000"
    
    # E-mail orgânico para o teste
    email_demo = f"espedito_{int(time.time())}@unifip.com"

    try:
        # ==========================================
        # MÓDULO 1: CADASTRO DE USUÁRIO
        # ==========================================
        print("\n>>> INICIANDO APRESENTAÇÃO SPECTRA <<<")
        driver.get(f"{base_url}/cadastro")
        time.sleep(1)

        # --- CT-01: Formulário Vazio ---
        print("\n[CT-01] Validando Cadastro Vazio...")
        btn_cad = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Cadastre')]")))
        destacar(driver, btn_cad)
        btn_cad.click()
        time.sleep(1.5) 

        # --- CT-02: Senhas Divergentes ---
        print("[CT-02] Validando Senhas Divergentes...")
        digitar_apresentacao(driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Nome')]"), "Erick Daniel")
        digitar_apresentacao(driver.find_element(By.XPATH, "//input[contains(@placeholder, 'E-mail')]"), email_demo)
        digitar_apresentacao(driver.find_element(By.XPATH, "//input[@placeholder='Senha']"), "123456")
        digitar_apresentacao(driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Confirmar')]"), "654321") # Diferente!
        digitar_apresentacao(driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Instituição')]"), "UNIFIP")
        driver.execute_script("arguments[0].click();", driver.find_element(By.XPATH, "//input[@type='checkbox']"))
        btn_cad.click()
        
        # Espera o erro aparecer na div vermelha (UX Amigável)
        wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'bg-red-50')]")))
        time.sleep(1) # Pausa para ver o erro "As senhas não coincidem"

        # Corrige a senha e cadastra (Para preparar o CT-03)
        limpar_campo(driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Confirmar')]"))
        digitar_apresentacao(driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Confirmar')]"), "123456")
        btn_cad.click()
        wait.until(EC.alert_is_present()).accept()
        time.sleep(1)

        # --- CT-03: E-mail Duplicado ---
        print("[CT-03] Validando Tratamento de E-mail Duplicado (UX)...")
        driver.get(f"{base_url}/cadastro") 
        wait.until(EC.presence_of_element_located((By.XPATH, "//input[contains(@placeholder, 'Nome')]"))).send_keys("Espedito Silva")
        driver.find_element(By.XPATH, "//input[contains(@placeholder, 'E-mail')]").send_keys(email_demo) # Mesmo email
        driver.find_element(By.XPATH, "//input[@placeholder='Senha']").send_keys("123456")
        driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Confirmar')]").send_keys("123456")
        driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Instituição')]").send_keys("UNIFIP")
        driver.execute_script("arguments[0].click();", driver.find_element(By.XPATH, "//input[@type='checkbox']"))
        driver.find_element(By.XPATH, "//button[contains(., 'Cadastre')]").click()
        
        # Espera o novo alerta amigável de e-mail duplicado aparecer na tela
        wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Este e-mail já está cadastrado')]")))
        time.sleep(2.5)

        # ==========================================
        # MÓDULO 2: LOGIN E AUTENTICAÇÃO
        # ==========================================
        # --- CT-04: Login com dados inválidos ---
        print("\n[CT-04] Validando Login com Credenciais Inválidas...")
        driver.get(base_url)
        input_login = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='E-mail']")))
        digitar_apresentacao(input_login, email_demo)
        digitar_apresentacao(driver.find_element(By.XPATH, "//input[@placeholder='Sua senha']"), "000000") # Errado
        driver.execute_script("arguments[0].click();", driver.find_element(By.XPATH, "//input[@type='checkbox']"))
        driver.find_element(By.XPATH, "//button[contains(., 'Fazer login')]").click()
        
        # Espera o erro aparecer na tela
        wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'bg-red-50')]")))
        time.sleep(2) 

        # Login de sucesso
        input_senha_refresh = driver.find_element(By.XPATH, "//input[@placeholder='Sua senha']")
        limpar_campo(input_senha_refresh)
        digitar_apresentacao(input_senha_refresh, "123456")
        driver.find_element(By.XPATH, "//button[contains(., 'Fazer login')]").click()
        
        wait.until(EC.url_contains("/home"))
        wait.until(EC.invisibility_of_element_located((By.CLASS_NAME, "animate-spin")))

        # ==========================================
        # MÓDULO 3: GESTÃO DE ALUNOS
        # ==========================================
        print("\n[CT-05 e CT-06] Validando Bloqueios no Cadastro de Aluno...")
        btn_add_aluno = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(@href, '/cadastrar-aluno')]")))
        destacar(driver, btn_add_aluno)
        driver.execute_script("arguments[0].click();", btn_add_aluno)
        wait.until(EC.url_contains("/cadastrar-aluno"))
        
        btn_concluir = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Concluir')]")))
        
        # --- CT-05: Novo Aluno sem Nome ---
        print(" -> Tentando salvar formulário vazio (Falta Nome)...")
        btn_concluir.click()
        time.sleep(1.5)

        # --- CT-06: Novo Aluno sem Data/Matrícula ---
        print(" -> Preenchendo Nome, mas deixando Data/Matrícula vazio...")
        input_nome_aluno = driver.find_element(By.XPATH, "//input[@placeholder='Nome Completo do Aluno']")
        digitar_apresentacao(input_nome_aluno, "Lucas Pereira")
        btn_concluir.click()
        time.sleep(1.5)

        # Sucesso no Aluno
        input_data = driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Data')]")
        destacar(driver, input_data)
        digitar_apresentacao(input_data, "10102015", delay=0.2)
        print(" -> Matrícula gerada automaticamente!")
        time.sleep(2)
        btn_concluir.click()
        wait.until(EC.alert_is_present()).accept()

        # ==========================================
        # MÓDULO 4: PLANOS PEI
        # ==========================================
        print("\n[CT-07 e CT-08] Validando Criação de Planos...")
        wait.until(EC.url_contains("/home"))
        driver.get(f"{base_url}/planos-ativos")
        wait.until(EC.invisibility_of_element_located((By.CLASS_NAME, "animate-spin")))
        
        btn_novo_plano = wait.until(EC.presence_of_element_located((By.XPATH, "//a[contains(@href, '/planos')]")))
        driver.execute_script("arguments[0].click();", btn_novo_plano)
        wait.until(EC.url_contains("/planos"))
        btn_finalizar = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Finalizar')]")))

        # --- CT-07: Criar Plano sem Aluno ---
        print(" -> Tentando criar sem selecionar Aluno...")
        destacar(driver, btn_finalizar)
        btn_finalizar.click()
        time.sleep(1.5)

        # --- CT-08: Criar Plano sem Diagnóstico ---
        print(" -> Selecionando Aluno, preenchendo título, mas sem Diagnóstico...")
        Select(driver.find_element(By.XPATH, "//select")).select_by_index(1)
        digitar_apresentacao(driver.find_element(By.XPATH, "//input[@placeholder='Ex: Plano Semestral']"), "Plano Inclusivo 2026")
        btn_finalizar.click()
        time.sleep(1.5)

        # Sucesso
        digitar_apresentacao(driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Autismo')]"), "TEA Nível 1")
        btn_finalizar.click()
        wait.until(EC.alert_is_present()).accept()
        wait.until(EC.url_contains("/planos-ativos"))

        # --- CT-09: Ajustar Plano com Campo Vazio ---
        print("\n[CT-09] Validando Edição de Plano...")
        wait.until(EC.invisibility_of_element_located((By.CLASS_NAME, "animate-spin")))
        time.sleep(1)

        btn_ajustar = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Ajustar Plano')]")))
        destacar(driver, btn_ajustar)
        btn_ajustar.click()
        time.sleep(1)

        print(" -> Apagando o Título do Plano na edição...")
        inputs_edicao = driver.find_elements(By.XPATH, "//input[contains(@class, 'bg-slate-50')]")
        input_titulo_edicao = inputs_edicao[1] 
        limpar_campo(input_titulo_edicao)
        
        btn_salvar_alt = driver.find_element(By.XPATH, "//button[contains(., 'Salvar Alterações')]")
        destacar(driver, btn_salvar_alt)
        btn_salvar_alt.click()
        
        # Como é uma requisição que falha, esperamos o seu novo alerta de erro da tela de edição
        wait.until(EC.alert_is_present()).accept()
        time.sleep(3) 

        print("\n>>> TODOS OS 9 CASOS DE TESTE EXECUTADOS! <<<")
        time.sleep(4)

    except Exception as e:
        print(f"\n[ERRO DE EXECUÇÃO]: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    executar_demo_final_com_todos_cts()