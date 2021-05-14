import React, { CSSProperties } from 'react';

interface ConditionsProps {
    cond_races: string[], // チェックボックスに当てる、ユニークな種族名の文字列配列
    cond_checkedRaces: string[], // チェックボックスでチェック済みの種族名の文字列配列
    handleChangeMultiCb: (e: React.ChangeEvent<HTMLInputElement>) => void, // チェックボックスをチェックした時のイベントハンドラ関数
    cond_name: string, // テキストボックスに入れた検索文字列
    handleChangeText: (e: React.ChangeEvent<HTMLInputElement>) => void // 検索文字列を変えた時のイベントハンドラ
}

/**
 * 検索部分の表示を行うConditionsコンポーネント。
 */
 const Conditions: React.FunctionComponent<ConditionsProps> =
  ({cond_races, cond_checkedRaces, handleChangeMultiCb, cond_name, handleChangeText}) => {
  // オブジェクト形式で上のように書くと、分割代入でpropsがそれぞれの変数に自動的に当てはめられる。
  // 親コンポ―ネントのstate管理されている状態の変数、ハンドラ関数、そのままセットするとそのまま使える。直感的。

  /**
   * そのチェックボックスがチェックされているかを返します。
   * @param {string} value チェックボックスのvalue値
   * @returns {boolean} true:チェックされている / チェックされていない
   */
  const calcIsChecked = (value: string): boolean => {
    if (cond_checkedRaces.indexOf(value) === -1) {
      return false;
    } else {
      return true;
    }
  }

  const divStyle: CSSProperties = {
    backgroundColor: '#7fffd4',
    width: '600px',
    height: '150px',
    padding: '8px',
    margin: '8px',
    borderRadius: '10px'
  };
  const inputStype: CSSProperties = {
    borderRadius: '16px',
    border: 'none',
    padding: '9px 16px',
    outline: 'none',
    width: '200px'
  };
  const boxStyle: CSSProperties = {
    borderRadius: '50%',
    borderColor: '#585753',
  };

  const liStyle: CSSProperties = {display: 'inline',};
  let checkBoxList: JSX.Element[] = [];
  for (let i: number = 0; i < cond_races.length; i++) {
    let race: string = cond_races[i];
    // 配列にチェックボックス1件分のJSXを追加していく。
    // handleChangeMultiCbは変数に関数が入っているので handleChangeMultiCb()とは書けない。
    // valueとかname,idあたりも厳密に
    // DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>'からチェックされるので注意。
    checkBoxList.push(
      <li key={i} style={liStyle}>
        <input
          type='checkbox'
          value={race}
          checked={calcIsChecked(race)}
          onChange={handleChangeMultiCb}
          name={String(i)}
          id={String(i)}
          style={boxStyle}
        />
        {race}
        &nbsp;
      </li>
    );
  }
  return (
    <div style={divStyle}>
      名前で絞り込むよ:&nbsp;
       <input style={inputStype} type="text" id="condName" name="condName" value={cond_name}
        placeholder="おともだちの名前を入れてね"
        onChange={handleChangeText} />
      <p>種族で絞り込むよ:</p>
      <ul>
        {checkBoxList}
      </ul>
    </div>
  );

};

export default Conditions;


