// css---------------------------------------////
import './App.css';
// css---------------------------------------////

// React e hook's------------------------------------////
import React from 'react';
import {useCallback,useEffect,useState} from "react";
// React ------------------------------------////

// arquivos data ---------------------------------/////
import {wordsList} from "./data/words";
// arquivos data ---------------------------------////

import StartScreen from "./components/StartScreen";
import GameOver from "./components/GameOver";
import Game from "./components/Game";

const stages = [
   {id:1 , name:"start"},
   {id:2 , name:"game"},
   {id:3 , name:"end"}
];

const guessesQty = 5

function App() {

const [gameStage,setGameStage] = useState(stages[0].name);
const [words] = useState(wordsList);

const [pickedWord,setPickedWord] = useState("");
const [pickedCategory,setPickedCategory] = useState("");
const [letters,setLetters] = useState([]);

const [guessedLetters ,setGuessedLetters] = useState([]) ; // letras advinhadas
const [wrongLetters,setWrongLetters] = useState([]); // letras erradas
const [guesses,setGuesses] = useState(guessesQty); // quantidade de tentativas permitidas 
const [score,setScore] = useState(0); // pontuação de palavras acertadas 


const pickedWordAndCategory = useCallback (() =>{

  // pega uma categoria aleatória 
    const categories = Object.keys(words) // só pega os atributos da array e cria  uma nova array só com os atributos
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    // console.log(category)
    // console.log(categories)

    // pega uma palavra  aleatória da categoria
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    // console.log(word)

    return {word,category}
},[words]);



// start do jogo --////
const startGame = useCallback (() =>{

  clearLetterStates()
  // função que pega palavra e pega categoria 
 const {word,category} = pickedWordAndCategory();
//  console.log(word,category)

 //pega as letras das palavras
 let wordLetters = word.split("");
 wordLetters = wordLetters.map((l) => l.toLowerCase()); // transformar todas as letras em minusculas
//  console.log(wordLetters);

 setPickedWord(word);
 setPickedCategory(category);
 setLetters (wordLetters);



  setGameStage (stages[1].name)
},[pickedWordAndCategory])

// process the letter input 
const verifyLetter = (letter) => {
   const normalizedLetter = letter.toLowerCase()

   // verifica se a letra já foi utilizada 
   if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter) ) {
        return;
   }

   // adiciona uma letra na array or remove a tentativa
   if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter,
      ])
   }else {
      setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters,
          normalizedLetter,
        ]);

        setGuesses((actualGuesses) => actualGuesses -1 );
   };

};
const clearLetterStates = () =>{
  setGuessedLetters ([]);
  setWrongLetters ([]);

}


// verificar as tentativas 
useEffect(() =>{

  if(guesses <= 0 ) {
    clearLetterStates()
    setGameStage (stages[2].name)
  }

},[guesses])


// verifica a condição de vitória
useEffect (() => {
   const uniqueLetters = [...new Set(letters)]

   // condição de vitória
   if(guessedLetters.length === uniqueLetters.length) {

   // adiciona a pontuação 
    setScore((actualScore) => (actualScore += 100))
    
    // reinicia o jogo com uma nova palavra
    startGame();

   }
},[guessedLetters,letters,startGame])

// reinicia o jogo -- ////
const retry = () =>{
  setScore(0);
  setGuesses(guessesQty);
  setGameStage (stages[0].name)
}

  return (
    <div className="App">
      {gameStage === "start" &&  <StartScreen startGame = {startGame} />}

      {gameStage === "game" &&  <Game 
          verifyLetter = {verifyLetter}
          pickedWord={pickedWord}
          pickedCategory = {pickedCategory}
          letters = {letters}

          guessedLetters = {guessedLetters}
          wrongLetters = {wrongLetters}
          guesses = {guesses}
          score = {score}
      />}
      
      {gameStage === "end" &&  <GameOver retry ={retry} score = {score}/>}
    </div>
  );
}

export default App;
