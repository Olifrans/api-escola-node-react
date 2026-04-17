

























Você quis dizer: axios 1.15.0, esta vulnerável?

Visão geral criada por IA
Com base nas informações recentes, a versão 1.15.0 do Axios foi lançada para corrigir uma vulnerabilidade de segurança crítica identificada anteriormente (CVE-2025-62718). 
National Institute of Standards and Technology (.gov)
National Institute of Standards and Technology (.gov)
Aqui estão os pontos chave:
Vulnerabilidade Corrigida: Versões anteriores a 1.15.0 (e 0.31.0) apresentavam um erro no tratamento de regras NO_PROXY, permitindo que ataques contornassem proxies e atingissem serviços internos (SSRF).
Status da 1.15.0: Esta versão especificamente corrige esse problema, tornando-a segura contra a falha citada.
Contexto de Segurança Geral: No entanto, houve relatos recentes (abril de 2026) sobre ataques à cadeia de suprimentos envolvendo outras versões (como 1.14.1). Recomenda-se enfaticamente o uso das versões mais recentes disponíveis e a verificação do package-lock.json para garantir que você não esteja usando versões comprometidas (como axios@1.14.1). 
National Institute of Standards and Technology (.gov)
National Institute of Standards and Technology (.gov)
 +2
Recomendação: Se estiver usando uma versão anterior a 1.15.0, atualize imediatamente para a 1.15.0 ou superior para mitigar a CVE-2025-62718. Além disso, verifique seus pacotes para garantir que não foi alvo do comprometimento na cadeia de suprimentos relatado no final de março/início de abril de 2026. 
TecMundo
TecMundo
 +1