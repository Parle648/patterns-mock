import { Database } from "../data/database";

const db = Database.Instance;

// PATTERN: memento
class Memento {
  public memo: string[] = [];
  public index: number = -1;

  public createInitialMemo(lists: string) {
    this.memo.push(lists);
  }

  public createMemo(lists: string) {
    this.memo.push(lists);

    this.index = this.memo.length - 1;
  }

  public memoBack() {
    if (this.index > 0) {
      this.index = this.index - 1;
      db.setData(JSON.parse(this.memo[this.index]))
      this.memo.push(this.memo[this.index])
      
      return JSON.parse(this.memo[this.index]);
    }
    return JSON.parse(this.memo[0]);
  }

  public memoAhead() {
    if (this.index === this.memo.length - 1) {
      return JSON.parse(this.memo[this.index]);
    }
    this.index += 1;
    return JSON.parse(this.memo[this.index]);
  }
}

const memoService = new Memento();
export { memoService };
