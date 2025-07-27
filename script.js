// DOM Elements
const sidebarToggleBtns = document.querySelectorAll(".sidebar-toggle");
const sidebar = document.querySelector(".sidebar");
const searchForm = document.querySelector(".search-form");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");
const menuLinks = document.querySelectorAll(".menu-link");
const contentSections = document.querySelectorAll(".content-section");

// Theme Management
const updateThemeIcon = () => {
  const isDark = document.body.classList.contains("dark-theme");
  const isCollapsed = sidebar.classList.contains("collapsed");
  
  if (isCollapsed) {
    themeIcon.textContent = isDark ? "light_mode" : "dark_mode";
  } else {
    themeIcon.textContent = "dark_mode";
  }
};

// Initialize theme
const initializeTheme = () => {
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const shouldUseDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

document.body.classList.toggle("dark-theme", shouldUseDarkTheme);
updateThemeIcon();
};

// Theme toggle event
themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();
});

// Sidebar toggle events
sidebarToggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    const container = document.querySelector(".container");
    if (sidebar.classList.contains("collapsed")) {
      container.classList.remove("sidebar-expanded");
    } else {
      container.classList.add("sidebar-expanded");
    }
    updateThemeIcon();
  });
});

// Search form expand sidebar
searchForm.addEventListener("click", () => {
  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
    searchForm.querySelector("input").focus();
  }
});

// Keep sidebar collapsed by default on all screens
// sidebar.classList.add("collapsed");

// Initialize Swiper
const initSwiper = () => {
new Swiper('.card-wrapper', {
    loop: true,
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
};

// Navigation Management
const initNavigation = () => {
menuLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

      // Remove active class from all links and sections
    menuLinks.forEach(l => l.classList.remove("active"));
      
      // Hide all sections first
      contentSections.forEach(section => {
        section.classList.remove("active");
        section.style.display = "none";
        section.style.visibility = "hidden";
        section.style.opacity = "0";
      });
      
      // Add active class to clicked link
    link.classList.add("active");
      
      // Show target section
    const targetId = link.dataset.target;
      if (targetId) {
    const targetSection = document.getElementById("section-" + targetId);
    if (targetSection) {
      targetSection.classList.add("active");
          targetSection.style.display = "block";
          targetSection.style.visibility = "visible";
          targetSection.style.opacity = "1";
          
          // Initialize specific apps based on target
          switch(targetId) {
            case "trochoi":
        initMemoryGame();
              break;
            case "ve":
  initDrawingApp();
              break;
            case "piano":
    initPiano();
              break;
            case "edit":
              initImageEditor();
              break;
            case "hanggames":
              initHangmanGame();
              break;
          }
  }
    }
  });
});
};

// Memory Game
let memoryGameInitialized = false;

const initMemoryGame = () => {
  if (memoryGameInitialized) return;
  memoryGameInitialized = true;

  const cards = document.querySelectorAll("#section-trochoi .card");
  let matched = 0;
  let cardOne, cardTwo;
  let disableDeck = false;

  const flipCard = ({ target: clickedCard }) => {
    if (cardOne !== clickedCard && !disableDeck) {
      clickedCard.classList.add("flip");
      if (!cardOne) {
        return cardOne = clickedCard;
      }
      cardTwo = clickedCard;
      disableDeck = true;
      const cardOneImg = cardOne.querySelector(".back-view img").src;
      const cardTwoImg = cardTwo.querySelector(".back-view img").src;
      matchCards(cardOneImg, cardTwoImg);
    }
  };

  const matchCards = (img1, img2) => {
    if (img1 === img2) {
      matched++;
      if (matched == 8) {
        setTimeout(() => {
          shuffleCard();
        }, 1000);
      }
      cardOne.removeEventListener("click", flipCard);
      cardTwo.removeEventListener("click", flipCard);
      cardOne = cardTwo = "";
      disableDeck = false;
    } else {
      setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
      }, 400);

      setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
      }, 1200);
    }
  };

  const shuffleCard = () => {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";
    const arr = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
      card.classList.remove("flip", "shake");
      const imgTag = card.querySelector(".back-view img");
      imgTag.src = `images/img-${arr[i]}.png`;
    });
  };

  cards.forEach(card => {
    card.addEventListener("click", flipCard);
  });

  shuffleCard();
};

// Drawing App
let drawingAppInitialized = false;

const initDrawingApp = () => {
  if (drawingAppInitialized) return;
  drawingAppInitialized = true;

  const canvas = document.querySelector("#section-ve canvas");
  const toolBtns = document.querySelectorAll("#section-ve .tool");
  const fillColor = document.querySelector("#section-ve #fill-color");
  const sizeSlider = document.querySelector("#section-ve #size-slider");
  const colorBtns = document.querySelectorAll("#section-ve .colors .option");
  const colorPicker = document.querySelector("#section-ve #color-picker");
  const clearCanvas = document.querySelector("#section-ve .clear-canvas");
  const saveImg = document.querySelector("#section-ve .save-img");
  const ctx = canvas.getContext("2d");

  let prevMouseX, prevMouseY, snapshot;
  let isDrawing = false;
  let selectedTool = "brush";
  let brushWidth = 5;
  let selectedColor = "#000";

  const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
  };

  // Initialize canvas
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();

  const drawRect = (e) => {
    if (!fillColor.checked) {
      return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  };

  const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
  };

  const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
  };

  const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
      ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    } else if (selectedTool === "rectangle") {
      drawRect(e);
    } else if (selectedTool === "circle") {
      drawCircle(e);
    } else {
      drawTriangle(e);
    }
  };

  toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector("#section-ve .options .active")?.classList.remove("active");
      btn.classList.add("active");
      selectedTool = btn.id;
    });
  });

  sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

  colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector("#section-ve .options .selected")?.classList.remove("selected");
      btn.classList.add("selected");
      selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
  });

  colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
  });

  clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
  });

  saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
  });

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", drawing);
  canvas.addEventListener("mouseup", () => isDrawing = false);
};

// Piano App
let pianoInitialized = false;

const initPiano = () => {
  if (pianoInitialized) return;
  pianoInitialized = true;

  const pianoKeys = document.querySelectorAll(".piano-keys .key");
  const volumeSlider = document.querySelector(".volume-slider input");
  const keysCheckbox = document.querySelector(".keys-checkbox input");

  let allKeys = [];
  let audio = new Audio(`tunes/a.wav`);

  const playTune = (key) => {
    audio.src = `tunes/${key}.wav`;
    audio.play();

    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    clickedKey?.classList.add("active");
    setTimeout(() => {
      clickedKey?.classList.remove("active");
    }, 150);
  };

  pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key);
    key.addEventListener("click", () => playTune(key.dataset.key));
  });

  const handleVolume = (e) => {
    audio.volume = e.target.value;
  };

  const showHideKeys = () => {
    pianoKeys.forEach(key => key.classList.toggle("hide"));
  };

  const pressedKey = (e) => {
    if (allKeys.includes(e.key)) playTune(e.key);
  };

  keysCheckbox.addEventListener("click", showHideKeys);
  volumeSlider.addEventListener("input", handleVolume);
  document.addEventListener("keydown", pressedKey);
};

// Image Editor
let imageEditorInitialized = false;

const initImageEditor = () => {
  if (imageEditorInitialized) return;
  imageEditorInitialized = true;

  const fileInput = document.querySelector(".file-input");
  const filterOptions = document.querySelectorAll(".filter button");
  const filterName = document.querySelector(".filter-info .name");
  const filterValue = document.querySelector(".filter-info .value");
  const filterSlider = document.querySelector(".slider input");
  const rotateOptions = document.querySelectorAll(".rotate button");
  const previewImg = document.querySelector(".preview-img img");
  const resetFilterBtn = document.querySelector(".reset-filter");
  const chooseImgBtn = document.querySelector(".choose-img");
  const saveImgBtn = document.querySelector(".save-img");

  let brightness = "100", saturation = "100", inversion = "0", grayscale = "0";
  let rotate = 0, flipHorizontal = 1, flipVertical = 1;

  const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
      resetFilterBtn.click();
      document.querySelector(".editor-container").classList.remove("disable");
    });
  };

  const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  };

  filterOptions.forEach(option => {
    option.addEventListener("click", () => {
      document.querySelector(".filter .active")?.classList.remove("active");
      option.classList.add("active");
      filterName.innerText = option.innerText;

      if (option.id === "brightness") {
        filterSlider.max = "200";
        filterSlider.value = brightness;
        filterValue.innerText = `${brightness}%`;
      } else if (option.id === "saturation") {
        filterSlider.max = "200";
        filterSlider.value = saturation;
        filterValue.innerText = `${saturation}%`;
      } else if (option.id === "inversion") {
        filterSlider.max = "100";
        filterSlider.value = inversion;
        filterValue.innerText = `${inversion}%`;
      } else {
        filterSlider.max = "100";
        filterSlider.value = grayscale;
        filterValue.innerText = `${grayscale}%`;
      }
    });
  });

  const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
      brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
      saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
      inversion = filterSlider.value;
    } else {
      grayscale = filterSlider.value;
    }
    applyFilter();
  };

  rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
      if (option.id === "left") {
        rotate -= 90;
      } else if (option.id === "right") {
        rotate += 90;
      } else if (option.id === "horizontal") {
        flipHorizontal = flipHorizontal === 1 ? -1 : 1;
      } else {
        flipVertical = flipVertical === 1 ? -1 : 1;
      }
      applyFilter();
    });
  });

  const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
  };

  const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
      ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
  };

  filterSlider.addEventListener("input", updateFilter);
  resetFilterBtn.addEventListener("click", resetFilter);
  saveImgBtn.addEventListener("click", saveImage);
  fileInput.addEventListener("change", loadImage);
  chooseImgBtn.addEventListener("click", () => fileInput.click());
};

// Hangman Game
let hangmanGameInitialized = false;

const initHangmanGame = () => {
  const hangmanBox = document.querySelector("#section-hanggames .hangman-box img");
  const wordDisplay = document.querySelector("#section-hanggames .word-display");
  const hintText = document.querySelector("#section-hanggames .hint-text b");
  const guessesText = document.querySelector("#section-hanggames .guesses-text b");
  const keyboard = document.querySelector("#section-hanggames .keyboard");
  const gameModal = document.querySelector("#section-hanggames .game-modal");
  const playAgainBtn = document.querySelector("#section-hanggames .play-again");

  // Game mode elements
  const modeButtons = document.querySelectorAll("#section-hanggames .mode-btn");
  const customWordInput = document.querySelector("#section-hanggames .custom-word-input");
  const customWordField = document.querySelector("#section-hanggames #custom-word");
  const customHintField = document.querySelector("#section-hanggames #custom-hint");
  const startCustomGameBtn = document.querySelector("#section-hanggames .start-custom-game");
  const gameContainer = document.querySelector("#section-hanggames .hangman-game-container");
  const modeSelector = document.querySelector("#section-hanggames .game-mode-selector");
  const backToModeBtns = document.querySelectorAll("#section-hanggames .back-to-mode-btn");

  let currentWord = "";
  let currentHint = "";
  let wrongGuessCount = 0;
  let correctLetters = [];
  let gameMode = "random"; // "random" or "custom"
  let isCustomGameCompleted = false;
  const maxGuesses = 6;

  // Function to show mode selector
  const showModeSelector = () => {
    modeSelector.style.display = "block";
    customWordInput.style.display = "none";
    gameContainer.style.display = "none";
    // Reset custom inputs
    customWordField.value = "";
    customHintField.value = "";
  };

  // Function to hide mode selector
  const hideModeSelector = () => {
    modeSelector.style.display = "none";
  };

  // Back to mode buttons
  backToModeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      showModeSelector();
    });
  });

  // Game mode selection
  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      modeButtons.forEach(b => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");
      
      gameMode = btn.dataset.mode;
      
      if (gameMode === "custom") {
        hideModeSelector();
        customWordInput.style.display = "block";
        gameContainer.style.display = "none";
      } else {
        hideModeSelector();
        customWordInput.style.display = "none";
        gameContainer.style.display = "flex";
        initGame();
      }
    });
  });

  // Start custom game
  startCustomGameBtn.addEventListener("click", () => {
    const customWord = customWordField.value.trim().toLowerCase();
    const customHint = customHintField.value.trim();
    
    if (!customWord) {
      alert("Vui lòng nhập từ cần đoán!");
      return;
    }
    
    if (!/^[a-z]+$/.test(customWord)) {
      alert("Từ chỉ được chứa chữ cái (a-z)!");
      return;
    }
    
    currentWord = customWord;
    currentHint = customHint || "Không có gợi ý";
    isCustomGameCompleted = false;
    
    // Hide custom input and show game
    customWordInput.style.display = "none";
    gameContainer.style.display = "flex";
    
    initGame();
  });

  const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanBox.src = "images/hangman-0.svg";
    gameModal.classList.remove("show");
    keyboard.querySelectorAll("button").forEach(btn => btn.disabled = false);
    
    // If custom game was completed, go back to mode selector
    if (isCustomGameCompleted && gameMode === "custom") {
      showModeSelector();
      return;
    }
    
    initGame();
  };

  const getRandomWord = () => {
    if (gameMode === "random") {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      const { word, hint } = wordList[randomIndex];
      return { word, hint };
    } else {
      return { word: currentWord, hint: currentHint };
    }
  };

  const gameOver = (isVictory) => {
    // Mark custom game as completed
    if (gameMode === "custom") {
      isCustomGameCompleted = true;
    }
    
    setTimeout(() => {
      const modalText = isVictory ? `You found the word:` : `The correct word was:`;
      gameModal.querySelector("h4").textContent = isVictory ? `Congrats!` : `Game Over!`;
      gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
      gameModal.classList.add("show");
    }, 300);
  };

  const initGame = () => {
    const { word, hint } = getRandomWord();
    currentWord = word;
    currentHint = hint;
    
    // Display word and hint
    wordDisplay.innerHTML = word
      .split("")
      .map(() => `<li class="letter"></li>`)
      .join("");
    hintText.textContent = hint;
    guessesText.textContent = `${wrongGuessCount} / ${maxGuesses}`;
    
    // Generate keyboard
    keyboard.innerHTML = "abcdefghijklmnopqrstuvwxyz"
      .split("")
      .map(letter => `<button>${letter}</button>`)
      .join("");
    
    // Add event listeners to keyboard buttons
    keyboard.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const clickedLetter = e.target.textContent;
        e.target.disabled = true;
        handleGuess(clickedLetter);
      });
    });
  };

  const handleGuess = (clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
      [...currentWord].forEach((letter, index) => {
        if (letter === clickedLetter) {
          correctLetters.push(letter);
          wordDisplay.querySelectorAll("li")[index].textContent = letter;
          wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
        }
      });
    } else {
      wrongGuessCount++;
      hangmanBox.src = `images/hangman-${wrongGuessCount}.svg`;
    }
    
    guessesText.textContent = `${wrongGuessCount} / ${maxGuesses}`;
    
    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
  };

  playAgainBtn.addEventListener("click", resetGame);
  
  // Initialize with mode selector visible, game hidden
  gameContainer.style.display = "none";
  customWordInput.style.display = "none";
};

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initSwiper();
  initNavigation();
  
  // Ensure sidebar is collapsed by default (showing only icons)
  sidebar.classList.add("collapsed");
  const container = document.querySelector(".container");
  container.classList.remove("sidebar-expanded");
  
  // Ensure only the first section is visible on load
  contentSections.forEach((section, index) => {
    if (index === 0) {
      section.classList.add("active");
      section.style.display = "block";
      section.style.visibility = "visible";
      section.style.opacity = "1";
    } else {
      section.classList.remove("active");
      section.style.display = "none";
      section.style.visibility = "hidden";
      section.style.opacity = "0";
    }
  });
});
