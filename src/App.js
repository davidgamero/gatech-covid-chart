import React, { useState, useEffect } from 'react';
import './App.css';
import Papa from 'papaparse';
import { Line } from '@nivo/line'
import moment from 'moment';
import GridLoader from 'react-spinners/GridLoader';
import { FaGithubSquare } from 'react-icons/fa'
import GraphTimeRangeSelector from './components/graphTimeRangeSelector';

function App() {
  const CSV_URL = 'https://gatech-covid-19-data.s3.amazonaws.com/gatech_covid_data.csv';

  // Full data set
  let [data, setData] = useState();

  // Data to be shown on the graph
  let [graphData, setGraphData] = useState();
  let [tableData, setTableData] = useState();

  let DESKTOP_SCREEN = window.innerWidth > 700;
  
  let ndaysAgo = (n) => {return new Date(new Date() - 1000 * 60*60*24*n)};
  let twoweeksAgo = new Date(new Date() - 1000 * 60*60*24*31);
  let [graphStartDate, setGraphStartDate] = useState(twoweeksAgo);
  let [graphNDaysAgo,setGraphNDaysAgo] = useState(31);

  useEffect(() => {
    setGraphStartDate(ndaysAgo(graphNDaysAgo));
  },[graphNDaysAgo])

  let timeRanges = [
    {
      label: '1 year',
      daysAgo: 365
    },
    {
      label: '30 days',
      daysAgo: 31
    },
    {
      label: '14 days',
      daysAgo: 15
    }
  ];

  console.log(graphStartDate);

  useEffect(() => {
    document.title = "GATech Covid-19 Chart"
  }, []);

  useEffect(() => {
    Papa.parse(CSV_URL,
      {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results, file) => {
          // console.log(results);

          // Filter for valid rows
          let data = results.data.filter((row) =>
            row.date && row.cases);
          data = data.reverse();
          console.log(`Found ${data.length} valid rows from ${data[0].date} to ${data[data.length - 1].date}`)

          // Map to dates
          data = data.map((row) => ({
            date: new Date(row.date),
            cases: row.cases,
          }));

          let gdata = data.filter((d) => d.date > graphStartDate);
          console.log(`Showing ${gdata.length} days starting from ${graphStartDate}`)
          console.log(gdata);
          
          // Map to xy
          let xydata = gdata.map((row) => ({
            x: row.date,
            y: row.cases
          }));
          
          setTableData(data.reverse());
          setGraphData([{
            id: 0,
            data: [...xydata]
          }]);
          console.log(data);
        }
      })
  }, [graphStartDate]);

  const theme = {
    textColor: '#ffffff',
  };
  //console.log('' + window.innerWidth + ' ' + window.innerHeight);
  return (
    <div className="App">
      <header className="App-header">
        {
          graphData ?
            <div>
              <h1>Georgia Tech Daily Covid-19 Cases</h1>
              <div className="fork-me">
                <a className="fork-me" href="https://github.com/davidgamero/gatech-covid-chart">Fork me on GitHub </a>
                <FaGithubSquare size={25} />
              </div>
              <Line
                data={graphData}

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
                  format: '%b %d',
                  tickValues: Math.floor(window.innerWidth / 100),
                  legendPosition: 'middle'
                }}
                axisLeft={{
                  legend: 'Cases',
                  legendOffset: -40,
                  legendPosition: 'middle'
                }}
                axisTop={null}
                axisRight={null}
                enablePoints={DESKTOP_SCREEN}
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
              <div>
                <GraphTimeRangeSelector
                timeRanges={timeRanges}
                setGraphNDaysAgo={setGraphNDaysAgo}
                graphNDaysAgo={graphNDaysAgo}/>
              </div>
              <h3 className="table-title">Data from
                <a className="table-title" href="https://github.com/davidgamero/gatech-covid-data-scraper">gatech-covid-data-scraper</a>
              </h3>
              <table width={window.innerWidth * 0.8}
                className="covid-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Cases</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => {
                    return <tr className="covid-table" key={index}>
                      <td className="covid-table">{moment(row.date).format('MMM-DD-YYYY')}</td>
                      <td className="covid-table">{row.cases}</td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div> : <div>
              <GridLoader size={15} color="rgb(232, 193, 160)"></GridLoader>
              <h3>Loading COVID Data...</h3>
            </div>
        }
      </header>
    </div>
  );
}

export default App;
