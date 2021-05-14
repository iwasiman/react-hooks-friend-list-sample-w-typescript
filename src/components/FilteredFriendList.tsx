import React, { CSSProperties } from 'react';
import {Friend} from './Types';

// 複数の子コンポーネントでこのインターフェース名を同じにしてしまうとエラーの原因になる。(裏で結合されるから?)
interface FilteredFriendListProps {
    filteredList: Friend[], // フィルター済みのFriendオブジェクトの配列
}

/**
 * 絞り込まれたお友達一覧を動的表示するFilteredFriendListコンポーネント。
 */
 const FilteredFriendList: React.FunctionComponent<FilteredFriendListProps> =
  ({filteredList}) => {

  const trEvenStyle: CSSProperties = {
    background: '#f5f5f5'
  };
  const trOddEvenStyle: CSSProperties = {
    background: '#FFFFFF'
  };
  // 偶数奇数の色分けはJSX内のstyle要素の警告が強く、ちょっと手間取る。
  const evenOdd = (index: number): CSSProperties => {
    return index % 2 === 0? trEvenStyle: trOddEvenStyle;
  };
  const tableStyle: CSSProperties = {
    width: '600px',
    borderCollapse: 'separate',
    border: 'none',
    borderSpacing: '0px 10px',
  }
  const tHeadThStyle: CSSProperties = {
    color: '#FFF',
    fontWeight: 'bold',
    background: '#00BCD4',
    textAlign: 'center',
  }

  return (
    <table style={tableStyle}>
      <thead style={tHeadThStyle}>
        <tr>
          <th style={tHeadThStyle}>なまえ</th>
          <th style={tHeadThStyle}>種族</th>
        </tr>
      </thead>
      <tbody>
        {
          filteredList.map((friend: Friend, index: number) => {
            return (
              <tr key={index} style={evenOdd(index)}>
                <td>{friend.name}</td>
                <td>{friend.race}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  );
};

export default FilteredFriendList;


