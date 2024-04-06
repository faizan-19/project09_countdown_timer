#! /usr/bin/env node

// Timer class to run a countdown timer

import inquirer from "inquirer";

class Timer {
  private intervalId: NodeJS.Timeout | null = null;
  private remainingSeconds: number = 0;

  public async run(): Promise<void> {
    while (true) {
      const input = await this.getUserInput();
      await this.startTimer(input);
      const continueOption = await this.continuePrompt();
      if (!continueOption) {
        console.log("Exiting timer.");
        break;
      }
    }
  }

  private async getUserInput(): Promise<number> {
    const res = await inquirer.prompt({
      type: "number",
      name: "userInput",
      message: "Please enter the amount of seconds: ",
      validate: (input) => {
        if (isNaN(input)) {
          return "Please enter a valid number";
        } else if (input > 60) {
          return "Seconds must be less than or equal to 60";
        } else {
          return true;
        }
      },
    });

    return res.userInput;
  }

  private displayTime(minutes: number, seconds: number): void {
    console.log(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
  }

  private async startTimer(seconds: number): Promise<void> {
    return new Promise((resolve) => {
      this.remainingSeconds = seconds || 60;
      this.intervalId = setInterval(() => {
        this.remainingSeconds--;

        if (this.remainingSeconds <= 0) {
          this.stopTimer();
          console.log("Time has expired");
          resolve();
        } else {
          const minutes = Math.floor(this.remainingSeconds / 60);
          const seconds = this.remainingSeconds % 60;
          this.displayTime(minutes, seconds);
        }
      }, 1000);
    });
  }

  private async continuePrompt(): Promise<boolean> {
    const { continueOption } = await inquirer.prompt({
      type: "confirm",
      name: "continueOption",
      message: "Do you want to continue?",
      default: true,
    });

    if (!continueOption) {
      this.stopTimer();
    }

    return continueOption;
  }

  private stopTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

async function main() {
  const timer = new Timer();
  await timer.run();
}

main();
