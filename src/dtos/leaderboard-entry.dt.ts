export class LeaderboardEntry {
  public username: string;
  public score: number;
  public rank: number;

  constructor(username: string, score: number, rank: number) {
    this.username = username;
    this.score = score;
    this.rank = rank;
  }
}
