export class Dateonly {
  constructor(private _year: number, private _month: number, private _day: number) { }

  public get year(): number { return this._year; }
  public get month(): number { return this._month; }
  public get day(): number { return this._day; }

  public static fromDate(date: Date): Dateonly {
    if(typeof date === "string") date = new Date(date);

    return new Dateonly(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  public compareTo(other: Dateonly): number {
    // return positive: this > other
    // return negative: this < other

    if(this._year !== other._year) { return this._year - other._year; }
    if(this._month !== other._month) { return this._month - other._month; }
    return this._day - other._day;
  }

  public getTimestamp(): number {
    return new Date(this._year, this._month - 1, this._day).getTime();
  }

  public equals(other: Dateonly): boolean {
    if(!other) return false;

    return this._year === other._year
      && this._month === other._month
      && this._day === other._day;
  }

  public toString(): string {
    return `${this._year}-${this._month}-${this._day}`;
  }
}

export class OrderedDateonlySet {
  private _dateList: Array<Dateonly> = [];

  constructor(private _descending: boolean = false) { }

  public add(date: Dateonly): void {
    if(this._dateList.some((d) => d.equals(date))) { return; }

    this._dateList.push(date);
    this._dateList.sort((a, b) => this._descending ? b.compareTo(a) : a.compareTo(b));
  }

  public asArray(): Array<Dateonly> {
    return this._dateList;
  }
}
