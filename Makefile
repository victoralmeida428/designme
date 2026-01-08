# Variáveis para facilitar manutenção
COMPOSE=docker compose
CONTAINER_APP=app

# .PHONY garante que o make não confunda o comando com um arquivo de mesmo nome
.PHONY: help up stop restart logs create migrate-up migrate-down status shell

# --- COMANDOS DO SISTEMA ---

# Ajuda: lista os comandos disponíveis
help:
	@echo "🎨 Design Me - Comandos disponíveis:"
	@echo "----------------------------------------------------------------"
	@echo "make up            -> Sobe os containers (com build)"
	@echo "make stop          -> Para os containers"
	@echo "make restart       -> Reinicia os containers"
	@echo "make logs          -> Vê os logs do app em tempo real"
	@echo "make shell         -> Entra no terminal do container (sh)"
	@echo "----------------------------------------------------------------"
	@echo "make status        -> Vê o status das migrações"
	@echo "make create name=X -> Cria nova migração (Ex: make create name=add_user)"
	@echo "make migrate-up    -> Roda as migrações pendentes"
	@echo "make migrate-down  -> Reverte (rollback) a última migração"
	@echo "----------------------------------------------------------------"

# Sobe o ambiente (Detach mode)
up:
	$(COMPOSE) up -d
	@echo "🚀 Ambiente rodando!

# Para o ambiente
stop:
	$(COMPOSE) down

# Reinicia
restart: stop up

# Vê logs
logs:
	$(COMPOSE) logs -f $(CONTAINER_APP)

# Acessa o shell do container
shell:
	$(COMPOSE) exec $(CONTAINER_APP) sh

# --- COMANDOS DE BANCO DE DADOS (Rodam dentro do container) ---

# Verifica status
status:
	$(COMPOSE) exec $(CONTAINER_APP) npm run db:status

# Cria uma nova migração
# Uso: make create name=nome_da_migracao
create:
	@if [ -z "$(name)" ]; then \
		echo "❌ Erro: Informe o nome da migração."; \
		echo "👉 Uso correto: make create name=criar_tabela_usuarios"; \
		exit 1; \
	fi
	$(COMPOSE) exec $(CONTAINER_APP) npm run db:create $(name)

# Roda o migrate UP
migrate-up:
	$(COMPOSE) exec $(CONTAINER_APP) npm run db:up

# Roda o migrate DOWN (Rollback)
migrate-down:
	$(COMPOSE) exec $(CONTAINER_APP) npm run db:down