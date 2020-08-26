import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Papa from 'papaparse';
import { Line, ResponsiveLine } from '@nivo/line'
import moment from 'moment';

function App() {
  const CSV_URL = 'https://gatech-covid-19-data.s3.amazonaws.com/gatech_covid_data.csv';

  let [data, setData] = useState();

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Georgia Tech COVID Cases over Time</h1>
        {
          data ?
            <Line
              data={data}

              width={window.innerWidth * 0.8}
              height={window.innerHeight * 0.8}

              useMesh={true}
              tooltip={({ point }) => {
                console.log(point)
                return <div>
                  <p class="tooltip-row">{point.data.xFormatted}</p>
                  <p class="tooltip-row">{'' + point.data.y + 'cases'}</p>
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
                format: '%Y %b %d',
                tickValues: 8,
                legendPosition: 'middle'
              }}
              axisLeft={{
                legend: 'Cases',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              axisTop={null}
              axisRight={null}
              enableGridX={false}
              enableGridY={false}
              theme={theme}
              margin={{
                bottom: 50,
                top: 50,
                left: 50,
                right: 50
              }}
            /> : 'Loading'
        }
      </header>
    </div>
  );
}

export default App;
