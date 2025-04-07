let colorsInfo = {
  colors: [
    {
      color: "black",
      category: "hue",
      type: "primary",
      code: {
        rgba: [255, 255, 255, 1],
        hex: "#000"
      }
    },
    {
      color: "brown",
      category: "value",
      code: {
        rgba: [165, 42, 42, 1],
        hex: "#A52A2A"
      }
    },
    {
      color: "red",
      category: "hue",
      type: "primary",
      code: {
        rgba: [255, 0, 0, 1],
        hex: "#FF0"
      }
    },
    {
      color: "blue",
      category: "hue",
      type: "primary",
      code: {
        rgba: [0, 0, 255, 1],
        hex: "#00F"
      }
    },
    {
      color: "yellow",
      category: "hue",
      type: "primary",
      code: {
        rgba: [255, 255, 0, 1],
        hex: "#FF0"
      }
    },
    {
      color: "green",
      category: "hue",
      type: "secondary",
      code: {
        rgba: [0, 255, 0, 1],
        hex: "#0F0"
      }
    }
  ]
};

const colorSplotches = document.querySelectorAll(`.color-splotch`);
const catIllustration = document.querySelectorAll(
  `.cat-illustration-svg-wrapper path`
);

contentFields = document.querySelectorAll(`.content-field-container span`);
for (let i = 0; i < colorsInfo.colors.length; i++) {
  colorSplotches[i].style.backgroundColor = colorsInfo.colors[i].color;
  colorSplotches[i].dataset.color = colorsInfo.colors[i].color;
  colorSplotches[i].dataset.colorCategory = colorsInfo.colors[i].category;
  colorSplotches[i].dataset.colorType = colorsInfo.colors[i].type;
  colorSplotches[i].dataset.colorCode = colorsInfo.colors[i].code.hex;
}

colorSplotches.forEach(splotch => {
  splotch.addEventListener("click", event => {
    contentFields[0].textContent = event.target.dataset.color;
    contentFields[1].textContent = event.target.dataset.colorCategory;
    contentFields[2].textContent = event.target.dataset.colorType;
    contentFields[3].textContent = event.target.dataset.colorCode;
    contentFields.forEach(field => {
      if (
        event.target.style.backgroundColor === "white" ||
        event.target.style.backgroundColor === "yellow"
      ) {
        field.style.color = "black";
      } else {
        field.style.color = event.target.style.backgroundColor;
      }
    });
    catIllustration.forEach(outline => {
      outline.addEventListener("click", entry => {
        entry.target.style.fill = event.target.dataset.color;
      });
    });
  });
});

const button = document.querySelector(`button`);
button.addEventListener("click", () => {
  for (var i = 0; i < catIllustration.length; i++) {
    catIllustration[i].style.fill = "white";
  }
});