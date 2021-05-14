import React, { useState, useEffect} from 'react';
import Conditions from './components/Conditions'
import {Friend} from './components/Types';
import FilteredFriendList from './components/FilteredFriendList'

// https://qiita.com/Takepepe/items/f1ba99a7ca7e66290f24 にあった指定方法
// eslint-disable-next-line
type EventProps = {
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onkeypress: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onClickDiv: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

// TypeScriptでコメントを書くTsDocはまだ完全標準化されていない模様。
// 書く場合も@params のあとの{型}は書かないらしい。
// https://blog.pokutuna.com/entry/tsdoc-tag-list
// https://tsdoc.org/

// 一般的にはこのインターフェース形式で書く。これで型制約を強制できる。
interface AppProps {
}

/**
 * お友達一覧の動的な絞り込み表示を行うAppコンポーネント。
 */
const App: React.FunctionComponent<AppProps> = () => {
  console.log("App FunctionComponent in");

  //type Friend = {name: string, race:string};

  // 関数コンポーネントなのでconstructor関数はない。定型コードも不要。

  // useStateを用いて保持するデータをステートで表現
  // TypeScriptではuseStateのジェネリックで型指定をしないと通らない。
  const [friendList, setFriendList] = useState<Friend[]>([]); // お友達リスト
  const [cond_races, setCond_races] = useState<string[]>([]); // // ユニークな種族名の配列
  const [cond_checkedRaces, setCond_checkedRaces] = useState<string[]>([]); // チェックされている種族名の配列
  const [cond_name, setCond_name] = useState<string>(""); // 絞り込みの名前


  // 初期表示時のみの処理 componentDidMount()に相当
  useEffect(() => {
    console.log("useEffect() in 初期表示時のみ");
    // バックエンドとの通信に見立てた内部メソッドからお友達一覧取得、ステート更新
    setFriendList(getFriendList());
    // お友達の中の種族を算出してステートとして更新 ここで変数friendListを使うとまだ値が入っていない。(非同期だから処理が終わってない?)
    // この変数condRacesは型を指定しなくても型推論でstring[]となる。
    const condRaces = calcCondRaces(getFriendList());
    setCond_races(condRaces);
    // eslint-disable-next-line
  }, []); // getFriendListがないと警告が出る
  
  /**
   * お友達一覧を取得します。
   * @returns Array お友達一覧の配列
   */
  const getFriendList = (): Friend[] => {
    // サーバーのAPIと通信してJSON形式で一覧を取得...のつもりのダミー。
    const list: Friend[] = [
      {name: "シューちゃん", race: "ねこ"},
      {name: "ジェラトーニ", race: "ねこ"},
      {name: "クマたん", race: "くま"},
      {name: "クマすけ", race: "くま"},
      {name: "テディベア", race: "くま"},
      {name: "リボンのくまさん", race: "くま"},
      {name: "ハンさん", race: "ユニコーン"},
      {name: "ダンテさん", race: "ドラゴン"},
      {name: "スカイア", race: "ドラゴン"},
      {name: "きりんさん", race: "キリン"},
      {name: "あかねまる", race: "きつね"},
      {name: "ペネロペ", race: "コアラ"},
      {name: "エトワール", race: "うさぎ"},
      {name: "うさぴょん", race: "うさぎ"},
      {name: "ミミちゃん", race: "うさぎ"},
      {name: "おうまさん", race: "うま"},
      {name: "イケアくん", race: "くま"},
      {name: "フーちゃん", race: "ふくろう"},
      {name: "ステラ・ルー", race: "うさぎ"},
      {name: "ガオちゃん", race: "きょうりゅう"},
      {name: "くんくん", race: "いぬ"},
    ];
    return list;
  }

  /**
   * お友達一覧からユニークな種族の文字列リストを算出します。
   * @param {Array} friendsArray お友達リストの配列
   * @returns {Array} ユニークな種族の文字列配列
   */
  const calcCondRaces = (friendsArray: Friend[]): string[] => {
    let races: string[] = [];
    // map()関数の引数に無名関数を定義、オブジェクトから種族のプロパティだけを取り出す
    races = friendsArray.map((friend) => {
      return friend.race
    });
    // さらに重複を取り除く。もっとよいやり方あるかも。
    // const uniqRaces: string[] = races.filter((value, index) => {
    //   return index === races.indexOf(value);
    // });

    // ネットの資料にある最速の方法 const array2 = [...new Set(array1)]; はTSだと以下のエラーが出る。
    // [型 'Set<string>' は配列型でも文字列型でもありません。反復子の反復を許可するには、コンパイラ オプション '--downlevelIteration' を使用します。]コンパイルエラー。
    // Setに渡した時点で重複が消えているので、以下のようにArray.fromで変換できる。
    const uniqRaces: string[] = Array.from(new Set<string>(races));
    return uniqRaces;
  }

  /**
   * お友達1件が条件に合うかを判定して返します。
   * @param {Friend} friend お友達1件のJSオブジェクト
   * @returns {boolean} true: フィルタ条件に合致 / false: 合致しない
   */
  const filterFunc = (friend: Friend): boolean => {
    // テキストボックスの絞り込み
    let isTargetText = false;
    if (cond_name.length !== 0) {
      if (friend.name.indexOf(cond_name) !== -1) {
        isTargetText = true;
      }
    } else {
      isTargetText = true;
    }

    // チェックが0件なら全件表示、そうでないならチェックされている種族のみ
    let isTargetCb = false;
    if (cond_checkedRaces.length === 0) {
      isTargetCb = true;
    } else {
      isTargetCb = cond_checkedRaces.indexOf(friend.race) !== -1;
    }
    return isTargetText && isTargetCb;
  }

  // イベントハンドラ系の関数はクラスコンポーネントだとconstructorの中で
  //    //決まり文句。生成時にバインドする
  //    this.calcIsChecked = this.calcIsChecked.bind(this);
  // のように定型コードが必要だったが、関数コンポーネントだといらなくなる。
  // またコード全体からステート回り、メンバ関数的な呼び出しでthis.が全部消えてスッキリ。

  /**
   * チェックボックス変更時のイベント処理を行います。
   * @param {React.ChangeEvent<HTMLInputElement>} e イベント
   */
  const handleChangeMultiCb = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // eをそのまま指定すると暗黙的にAnyでエラーになる
    // ステートで持っているチェックされた種族のリストを更新する。
    // useStateでのstateからコピーする時は、代入でなくスプレッド演算子で参照を切ってから複製することが必要!
    const checkedRaces = [...cond_checkedRaces];
    if (e.target.checked) {
      checkedRaces.push(e.target.value);
    } else {
      checkedRaces.splice(checkedRaces.indexOf(e.target.value), 1);
    }
    setCond_checkedRaces(checkedRaces);
  }

  /**
   * テキストボックス変更時のイベント処理を行います。
   * @param {React.ChangeEvent<HTMLInputElement>} e イベント
   */
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log("** handleChangeText in.", e.target.value);
    setCond_name(e.target.value);
  }

  // 画面を描画します。ReactのClassコンポーネントならrender()関数ですが関数コンポーネントなので戻り値となります。
  // 親コンポ―ネントのstate管理されている状態の変数、ハンドラ関数、そのままpropsで子供に渡して使える。直感的。
  // FilteredFriendListコンポーネントのように、ここで無名関数でfriendListを絞り込んだ結果をpropsで渡すとそのまま動的に表示。

  return (
    <div>
      <h2>お友達の一覧表示 with React Hooks and TypeScript</h2>

      <Conditions
        cond_races={cond_races}
        cond_checkedRaces={cond_checkedRaces}
        handleChangeMultiCb={handleChangeMultiCb}
        cond_name={cond_name}
        handleChangeText={handleChangeText}
      />

      <FilteredFriendList
        filteredList={friendList.filter((friend) =>{
          return filterFunc(friend);
        })}
      />

    </div>
  );
}

export default App;
