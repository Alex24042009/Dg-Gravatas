// firebase.js

// Importações do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js"; // Adicionado para Auth

// Configuração do seu projeto Firebase (verificada e preenchida)
const firebaseConfig = {
  apiKey: "AIzaSyBop0Z82rpv-6QzjvC6imDiOs4ppKp3EU4",
  authDomain: "dg-gravatas.firebaseapp.com",
  projectId: "dg-gravatas",
  storageBucket: "dg-gravatas.firebasestorage.app",
  messagingSenderId: "611084668",
  appId: "1:611084668:web:6e09eddecf7ff01d725cf9"
};

// Inicializa o Firebase
export const app = initializeApp(firebaseConfig); // Exporta a instância do app também

// Exporta a instância do Firestore para ser usada em outros módulos
export const db = getFirestore(app);

// Exporta a instância do Auth para ser usada em outros módulos
export const auth = getAuth(app);
