import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Papa from 'papaparse';
import { Line, ResponsiveLine } from '@nivo/line'
import moment from 'moment';
import GridLoader from 'react-spinners/GridLoader';

function App() {
  const CSV_URL = 'https://gatech-covid-19-data.s3.amazonaws.com/gatech_covid_data.csv';

  let [data, setData] = useState();
  let [tableData, setTableData] = useState();

  useEffect(() => {
    Papa.parse(CSV_URL,
      {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results, file) => {
          console.log(results);

          // Filter for valid rows
          data = results.data.filter((row) =>
            row.date && row.cases);
          data = data.reverse();
          console.log(`Found ${data.length} valid rows from ${data[0].date} to ${data[data.length - 1].date}`)

          // Map to xy
          data = data.map((row) => ({
            x: new Date(row.date),
            y: row.cases
          }));
          console.log(data);
          setTableData(data.reverse());
          setData([{
            id: 0,
            data: data
          }]);
        }
      })
  }, []);

  const theme = {
    textColor: '#ffffff',
  };
  console.log('' + window.innerWidth + ' ' + window.innerHeight);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Georgia Tech Daily COVID19 Cases</h1>
        {
          data ?
            <div>
              <Line
                data={data}

                width={window.innerWidth * 0.8}
                height={window.innerHeight * 0.6}

                useMesh={window.innerWidth > 700}
                tooltip={({ point }) => {
                  // console.log(point)
                  return <div>
                    <h3 class="tooltip-row">{point.data.xFormatted}</h3>
                    <h3 class="tooltip-row">{'' + point.data.y + 'cases'}</h3>
                  </div>
                }}
                enableSlices={false}
                yScale={{
                  type: 'linear'
                }}
                yFormat={(row) => 'a'}
                xFormat="time:%Y-%m-%d"
                xScale={{
                  type: 'time',
                  format: 'native',
                }}
                axisBottom={{
                  legend: 'Date',
                  legendOffset: 40,
                  format: '%b %d %Y',
                  tickValues: Math.floor(window.innerWidth / 200),
                  legendPosition: 'middle'
                }}
                axisLeft={{
                  legend: 'Cases',
                  legendOffset: -40,
                  legendPosition: 'middle'
                }}
                axisTop={null}
                axisRight={null}
                enablePoints={window.innerWidth > 700}
                enableGridX={false}
                enableGridY={false}
                theme={theme}
                margin={{
                  bottom: 50,
                  top: 50,
                  left: 50,
                  right: 50
                }}
              />
              <h3 class="table-title">Data from
                <a class="table-title" href="https://github.com/davidgamero/gatech-covid-data-scraper">gatech-covid-data-scraper</a>
              </h3>
              <table width={window.innerWidth * 0.8}
                class="covid-table">
                <tr>
                  <th>Date</th>
                  <th>Cases</th>
                </tr>
                <tbody>
                  {tableData.map((row) => {
                    return <tr class="covid-table">
                      <td class="covid-table">{moment(row.x).format('MMM-DD-YYYY')}</td>
                      <td class="covid-table">{row.y}</td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div> : <div>
              <GridLoader size={15} color="rgb(232, 193, 160)"></GridLoader>
              <h3>'Loading COVID Data...'</h3>
            </div>
        }
      </header>
    </div>
  );
}

export default App;
