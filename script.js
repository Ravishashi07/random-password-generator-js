const lengthSlider = document.querySelector(".pass-length input");
const lengthDisplay = document.querySelector(".pass-length span");
const options = document.querySelectorAll(".options input");
const passwordInput = document.querySelector(".input-box input");
const copyIcon = document.querySelector(".input-box span");
const generateBtn = document.querySelector(".generate-btn");
lengthDisplay.innerText = lengthSlider.value;

const characters = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+{}[]|:;<>,.?/~`-=",
};

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  toast.style.top = "20px";

  setTimeout(() => {
    toast.classList.remove("show");
    toast.style.top = "0px";
  }, 3000);
}

const getRandomChar = (set) => {
  return set[Math.floor(Math.random() * set.length)];
};

const shuffle = (str) => {
  let arr = [...str];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
};

const generatePassword = () => {
  let selectedOptions = [...options].filter(
    (opt) => opt.checked && characters[opt.id]
  );
  const excDuplicate = document.getElementById("exc-duplicate").checked;
  const passLength = parseInt(lengthSlider.value);

  if (selectedOptions.length === 0 || passLength === 0) {
    showToast(
      "⚠️ Please select at least one character type and ensure length is not zero."
    );
    return;
  }

  let password = "";
  let counts = [];

  if (passLength < selectedOptions.length) {
    selectedOptions = selectedOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, passLength);
    for (let i = 0; i < passLength; i++) {
      counts.push(1);
    }
  } else {
    let base = Math.floor(passLength / selectedOptions.length);
    let remainder = passLength % selectedOptions.length;
    for (let i = 0; i < selectedOptions.length; i++) {
      counts.push(base + (i < remainder ? 1 : 0));
    }
  }
  if (excDuplicate) {
    const totalAvailableUniqueChars = selectedOptions.reduce(
      (total, option) => {
        return total + new Set(characters[option.id]).size;
      },
      0
    );

    if (passLength > totalAvailableUniqueChars) {
      showToast(
        `⚠️ Not enough unique characters to generate a ${passLength}-character password with duplicates excluded. Either reduce length or enable more character types.`
      );
      return;
    }
  }

  selectedOptions.forEach((option, i) => {
    let charSet = characters[option.id];
    let generated = "";
    while (generated.length < counts[i]) {
      let char = getRandomChar(charSet);
      if (!excDuplicate || !password.includes(char)) {
        generated += char;
      }
    }
    password += generated;
  });

  passwordInput.value = shuffle(password);
};

const updateSlider = () => {
  lengthDisplay.innerText = lengthSlider.value;
};

copyIcon.addEventListener("click", () => {
  navigator.clipboard.writeText(passwordInput.value);
  copyIcon.innerText = "check";
  setTimeout(() => (copyIcon.innerText = "copy_all"), 2000);
});

lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);

const themeToggleBtn = document.getElementById("themeToggle");

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});