"use client";

import React from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';

interface SpreadsheetProps {
  className?: string;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ className = '' }) => {
  // 初始化数据
  const options = {
    lang: 'zh',  
    data: [
      {
        name: "工作表1",
        color: "blue", 
        status: 1,
        order: 0,
        data: [
          [
            { v: "项目名称", m: "项目名称", bl: 1 },
            { v: "预算", m: "预算", bl: 1 },
            { v: "实际支出", m: "实际支出", bl: 1 },
            { v: "差额", m: "差额", bl: 1 }
          ],
          [
            { v: "办公用品", m: "办公用品" },
            { v: 5000, m: "5000" },
            { v: 4800, m: "4800" },
            { v: "=B2-C2", f: "=B2-C2" }
          ],
          [
            { v: "差旅费", m: "差旅费" },
            { v: 8000, m: "8000" },
            { v: 7200, m: "7200" },
            { v: "=B3-C3", f: "=B3-C3" }
          ],
          [
            { v: "培训费", m: "培训费" },
            { v: 3000, m: "3000" },
            { v: 2500, m: "2500" },
            { v: "=B4-C4", f: "=B4-C4" }
          ],
          [
            { v: "总计", m: "总计", bl: 1 },
            { v: "=SUM(B2:B4)", f: "=SUM(B2:B4)", bl: 1 },
            { v: "=SUM(C2:C4)", f: "=SUM(C2:C4)", bl: 1 },
            { v: "=SUM(D2:D4)", f: "=SUM(D2:D4)", bl: 1 }
          ]
        ]
      }
    ],
    title: "在线表格处理工具",
    showsheetbar: true,
    showstatisticBar: true,
    sheetFormulaBar: true,
    allowCopy: true,
    allowEdit: true,
    enableAddRow: true,
    enableAddCol: true
  };

  return (
    <div className={`w-full h-full ${className}`}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Workbook {...options} />
    </div>
  );
};

export default Spreadsheet; 