# Momo App 🐾

O **Momo App** é uma aplicação móvel de monitorização de hábitos e saúde gamificada, construída com as mais recentes tecnologias do ecossistema React Native. O utilizador pode registar o consumo diário de água e proteína, bem como hábitos de medicação e exercício físico, acumulando pontos para subir de nível, tudo isto envolvido numa interface moderna (*Dark Theme*) e guiado por uma mascote felina em estilo anime.

---

## 🛠 Stack Tecnológico

A aplicação foi desenhada com foco em performance, tipagem estrita e separação clara de responsabilidades:

* **Framework Base:** React Native 0.85 + Expo SDK 56
* **Linguagem:** TypeScript 6.0
* **Roteamento:** Expo Router v56 (File-based routing)
* **Gestão de Estado de Cliente:** Zustand v5 (Leve e livre de *re-renders* desnecessários)
* **Gestão de Estado de Servidor:** TanStack Query v5 (Cache dinâmico, revalidação e mutações otimistas)
* **Comunicação HTTP:** Axios (Com intercetores para injeção automática de JWT)
* **Armazenamento Seguro:** Expo SecureStore (Gestão segura de tokens na *Keychain/Keystore*)
* **Ícones & UI:** Lucide React Native, Expo Glass Effect, Expo Linear Gradient
* **Animações:** React Native Reanimated & API nativa do React (`Animated`)
* **Qualidade de Código:** Biome (Substituindo ESLint e Prettier num único binário ultrarrápido)
* **Gestor de Pacotes:** pnpm

---

## 🚀 Como Iniciar o Projeto

### Pré-requisitos
Certifique-se de que tem instalado na sua máquina:
* Node.js (versão LTS recomendada)
* [pnpm](https://pnpm.io/installation) (Gestor de pacotes principal)
* Emulador Android (Android Studio), Simulador iOS (Xcode) ou a aplicação **Expo Go** no seu dispositivo físico.

### 1. Instalação de Dependências
Clone o repositório e instale as dependências.
```bash
pnpm install