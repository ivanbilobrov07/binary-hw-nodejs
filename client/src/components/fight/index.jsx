import React from "react";

import { getFighters } from "../../services/domainRequest/fightersRequest";
import {
  createFights,
  getFights,
} from "../../services/domainRequest/fightRequest";
import NewFighter from "../newFighter";
import Fighter from "../fighter";
import { Button } from "@material-ui/core";
import { Arena } from "../arena";

import "./fight.css";
import Notiflix from "notiflix";
import FightsHistory from "../fightsHistory";

class Fight extends React.Component {
  state = {
    fighters: [],
    fighter1: null,
    fighter2: null,
    isFightStarted: false,
    fights: [],
  };

  async componentDidMount() {
    const fighters = await getFighters();
    const fightsData = await getFights();

    if (fighters && !fighters.error) {
      this.setState({ fighters });
    }

    if (fightsData && !fightsData.error) {
      this.setState((s) => ({ ...s, fights: fightsData }));
    }
  }

  onFightStart = () => {
    if (!this.state.fighter1 || !this.state.fighter2) {
      Notiflix.Notify.failure("Select fighters before start the fight");
      return;
    }

    this.setState((prevState) => ({
      ...prevState,
      isFightStarted: true,
    }));
  };

  onCreate = (fighter) => {
    this.setState({ fighters: [...this.state.fighters, fighter] });
  };

  onFighter1Select = (fighter1) => {
    this.setState({ fighter1 });
  };

  onFighter2Select = (fighter2) => {
    this.setState({ fighter2 });
  };

  getFighter1List = () => {
    const { fighter2, fighters } = this.state;
    if (!fighter2) {
      return fighters;
    }

    return fighters.filter((it) => it.id !== fighter2.id);
  };

  getFighter2List = () => {
    const { fighter1, fighters } = this.state;
    if (!fighter1) {
      return fighters;
    }

    return fighters.filter((it) => it.id !== fighter1.id);
  };

  onFightFinished = async (fightData) => {
    const newFight = await createFights(fightData);

    this.setState((s) => ({
      ...s,
      isFightStarted: false,
      fights: [...s.fights, newFight],
      fighter1: null,
      fighter2: null,
    }));
  };

  render() {
    const { fighter1, fighter2, isFightStarted, fights } = this.state;

    if (isFightStarted) {
      return (
        <Arena
          firstFighter={fighter1}
          secondFighter={fighter2}
          onFinished={this.onFightFinished}
        />
      );
    }

    return (
      <div id="wrapper">
        <NewFighter onCreated={this.onCreate} />
        <div id="figh-wrapper">
          <Fighter
            selectedFighter={fighter1}
            onFighterSelect={this.onFighter1Select}
            fightersList={this.getFighter1List() || []}
          />
          <div className="btn-wrapper">
            <Button
              onClick={this.onFightStart}
              variant="contained"
              color="primary"
            >
              Start Fight
            </Button>
          </div>
          <Fighter
            selectedFighter={fighter2}
            onFighterSelect={this.onFighter2Select}
            fightersList={this.getFighter2List() || []}
          />
        </div>
        <FightsHistory fights={fights} />
      </div>
    );
  }
}

export default Fight;
