// Fruit pictures
const apple = "https://i.ibb.co/qnV559J/apple.png";
const avocado = "https://i.ibb.co/nzdcBSj/avocado.png";
const banana = "https://i.ibb.co/THDCVRy/banana.png";
const cherry = "https://i.ibb.co/qgxc1mM/cherry.png";
const kiwi = "https://i.ibb.co/tpm42xv/kiwi.png";
const lemon = "https://i.ibb.co/fvN2yjC/lemon.png";
const orange = "https://i.ibb.co/0MpDhw0/orange.png";
const peach = "https://i.ibb.co/3dk1WvK/peach.png";
const pear = "https://i.ibb.co/v3N0qJK/pear.png";
const plum = "https://i.ibb.co/SyhYc29/plums.png";
const strawberry = "https://i.ibb.co/1v2qrcr/strawberry.png";
const watermelon = "https://i.ibb.co/5Bgc0pk/watermelon.png";

const fruits = [
  plum,
  pear,
  apple,
  lemon,
  orange,
  peach,
  avocado,
  banana,
  cherry,
  watermelon,
  kiwi,
  strawberry,
];

const easiness = 8;

const createCards = (n) => {
  const array = [];
  for (let i = 0; i < n / 2; i++) {
    array.push(i);
    array.push(i);
  }
  return array;
};

const selectRandom = (n) => {
  let array = createCards(n);
  return () => {
    const l = array.length - 1;
    const item = array.splice(Math.random() * l, 1);
    return item[0];
  };
};

const shuffleCards = (n) => {
  let cards = [];
  let getRandomCard = selectRandom(n);
  for (let i = 0; i < n; i++) {
    cards.push({
      status: "closed",
      content: fruits[getRandomCard()],
    });
  }
  return cards;
};

class App extends React.Component {
  constructor(props) {
    super(props);

    const level = 1;

    const cards = shuffleCards(level * 8);

    this.state = {
      level,
      moves: 0,
      left: level * easiness,
      opened: 0,
      message: "Fruits memory game",
      show: [],
      cards,
      freeze: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.reset = this.reset.bind(this);
  }

  handleClick(e) {
    const self = e.target;

    const { show, opened, cards, moves, left, freeze } = this.state;

    if (!self.id || freeze || cards[self.id].status !== "closed") return;

    const nextShow = [...show];
    nextShow.push(self.id);

    const nextCards = [...cards];
    nextCards[self.id].status = "open";

    if (show.length === 0) {
      this.setState({ show: nextShow, cards: nextCards });
    } else if (show.length === 1) {
      if (cards[nextShow[0]].content === cards[nextShow[1]].content) {
        nextCards[nextShow[0]].status = "fixed-open";
        nextCards[nextShow[1]].status = "fixed-open";

        this.setState(
          {
            moves: moves + 1,
            left: left - 1,
            opened: opened + 1,
            show: [],
            cards: nextCards,
          },
          () => {
            const { opened, level } = this.state;
            if (opened === 4 * level)
              this.setState({
                message: "You Win! Well done!",
                level: level < 3 ? level + 1 : level,
              });
          }
        );
      } else {
        this.setState(
          {
            moves: moves + 1,
            left: left - 1,
            show: nextShow,
            cards: nextCards,
            freeze: true,
          },
          () => {
            if (this.state.left < this.state.level * 4 - this.state.opened) {
              this.setState({ message: "You lose :( Try again" });
              return;
            }

            setTimeout(() => {
              this.setState((prevState) => {
                const { show, cards } = prevState;
                const nextCards = [...cards];

                nextCards[show[0]].status = "closed";
                nextCards[show[1]].status = "closed";

                return {
                  show: [],
                  cards: nextCards,
                  freeze: false,
                };
              });
            }, 1000);
          }
        );
      }
    }
  }

  reset() {
    const cards = shuffleCards(this.state.level * 8);
    this.setState({
      moves: 0,
      left: this.state.level * easiness,
      opened: 0,
      message: "Fruits memory game",
      show: [],
      cards,
      freeze: false,
    });
  }

  render() {
    return /*#__PURE__*/ (
      React.createElement("div", { className: "app" }, /*#__PURE__*/
        React.createElement("h1", null, this.state.message), /*#__PURE__*/
        React.createElement("div", { className: "top-info" },
          React.createElement("div", null, "Level: ", this.state.level), /*#__PURE__*/ 
          React.createElement("div", null, "Moves: ", this.state.moves), /*#__PURE__*/ 
          React.createElement("div", null, "Moves left: ", this.state.left), /*#__PURE__*/ 
          React.createElement("button", { onClick: this.reset }, "New Game") // Button is now aligned below the texts
        ), /*#__PURE__*/
        React.createElement("div", { className: "card-container" },
          this.state.cards.map((card, index) => /*#__PURE__*/
            React.createElement("div", {
              className: `card ${card.status}`,
              id: index,
              key: index,
              onClick: this.handleClick,
            },
              card.status !== "closed" && /*#__PURE__*/ 
              React.createElement("img", { src: card.content, alt: "card" })
            )
          )
        )
      )
    );
  }
}

ReactDOM.render( /*#__PURE__*/ React.createElement(App, null), document.getElementById("root"));
