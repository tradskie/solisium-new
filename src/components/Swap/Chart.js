import './App.less';
import { createChart } from 'lightweight-charts';
import { useRef, useEffect, useState } from 'react';
import { getAllPrices, getLastPrice, getActivities } from './utils';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import dayjs from 'dayjs';
import { SwapOutlined, DollarOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Drawer, Typography, List, Space, Image, Avatar } from 'antd';
var utc = require('dayjs/plugin/utc');

let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
});
let serie;
const { Title } = Typography;
function App() {
  const [chartData, setChartData] = useState([]);
  const [actualPrice, setActualPrice] = useState({});
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [activities, setActivities] = useState([]);
  dayjs.extend(utc);
  useEffect(() => {
    _startStreamAllPrices();
    _startStreamActivities();
  }, []);
  const toggleDrawer = () => {
    setDrawerOpened((opened) => !opened);
  };
  const _startStreamAllPrices = async () => {
    await _getAllPrices();
    _startStreamPrices();
    setInterval(() => _getAllPrices(), 300000);
  };
  const _getAllPrices = async () => {
    let data = await getAllPrices();
    if (!data) return;
    // console.log(data);
    setChartData(data);
  };
  const _startStreamPrices = () => {
    _streamPrices();
    setInterval(() => _streamPrices(), 15000);
  };
  const _streamPrices = async () => {
    let data = await getLastPrice();
    if (!data) return;
    setActualPrice(data);
  };
  const _startStreamActivities = () => {
    _streamActivities();
    setInterval(() => _streamActivities(), 15000);
  };
  const _streamActivities = async () => {
    let data = await getActivities();
    if (!data) return;
    let reversed = data.activities.reverse();
    console.log(reversed);
    setActivities(reversed);
  };
  return (
    <HelmetProvider>
      <div className="App">
        <Helmet>
          <title>Splassive Tracker</title>
          <meta
            name="description"
            content="Track Splassive price in realtime"
          />
        </Helmet>
        <Drawer
          title={<div style={{ color: 'rgb(218, 204, 121)' }}>Activities</div>}
          placement="left"
          closeIcon={<CloseOutlined style={{ color: 'rgb(218, 204, 121)' }} />}
          width={350}
          headerStyle={{
            backgroundColor: 'rgb(78, 46, 75)',
            borderBottom: '1px solid rgb(78, 46, 75)',
          }}
          bodyStyle={{
            backgroundColor: '#86ad74',
          }}
          onClose={toggleDrawer}
          visible={drawerOpened}>
          <List
            // bordered
            size="small"
            dataSource={activities}
            renderItem={(item) => (
              <List.Item>
                <Space
                  style={{
                    color: item.type === 'Buy' ? 'green' : '#a83232',
                    fontWeight: 'bold',
                    fontSize: 12,
                  }}
                  align="center">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {dayjs(item.timestamp * 1000)
                      .utc()
                      .format('YYYY-MM-DD HH:mm:ss  ')}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {item.type === 'Buy' ? (
                      <span style={{ fontSize: 15.6 }}>🔥</span>
                    ) : (
                      <span style={{ fontSize: 15.6 }}>💔</span>
                    )}
                    <span style={{ marginLeft: 2 }}>
                      {item.type === 'Buy' ? (
                        <span>BUY</span>
                      ) : (
                        <span>SELL</span>
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Avatar
                      src={
                        <Image
                          src="./polygon-logo.png"
                          preview={false}
                          style={{ width: 24 }}
                        />
                      }
                      size="small"
                    />
                    {parseFloat(item.maticamount).toFixed(2)}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <DollarOutlined style={{ fontSize: 24 }} />
                    <span>
                      {formatter.format(
                        parseFloat(item.maticamount) * parseFloat(item.maticprice)
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Avatar
                      src={
                        <Image
                          src="./splassive.png"
                          preview={false}
                          style={{ width: 24 }}
                        />
                      }
                      size="small"
                    />
                    {parseFloat(item.splashquantity).toFixed(2)}
                  </div>
                </Space>
              </List.Item>
            )}
          />
        </Drawer>
        <div className="Legend">
          <div>Splassive Price Tracker</div>
          <div style={{ marginTop: 10, fontWeight: 'normal', fontSize: 14 }}>
            This is a community tool, made by{' '}
            <a
              href="https://t.me/Quin_6"
              style={{
                color: 'rgb(78, 46, 75)',
                textDecoration: 'none',
                borderBottom: '1px solid rgb(78, 46, 75)',
              }}>
              @Quin_6
            </a>
          </div>
          <div style={{ marginTop: 5, fontWeight: 'normal', fontSize: 14 }}>
            Donations : 0x11540EE1aa70De77ABeb2e39cf7497649549C0E1 ❤️
          </div>
          <div style={{ marginTop: 20, fontWeight: 'bold', fontSize: 18 }}>
            {actualPrice.value && formatter.format(actualPrice.value)}
          </div>
        </div>
        <div className="ActivitiesButton">
          <Button
            type="primary"
            icon={<SwapOutlined />}
            onClick={() => toggleDrawer()}
            style={{ color: 'rgb(218, 204, 121)' }}>
            Activity
          </Button>
        </div>
        <ChartComponent data={chartData} actualPrice={actualPrice} />
      </div>
    </HelmetProvider>
  );
}
const ChartComponent = ({ data, actualPrice }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    // console.log('data');
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };
    const chartOptions = {
      layout: {
        backgroundColor: '#86ad74',
        textColor: 'rgb(78, 46, 75)',
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          color: '#dacb7942',
        },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
    };
    const serieOptions = {
      topColor: 'rgba(78, 46, 75, 0.8)',
      bottomColor: 'rgba(78, 46, 75, 0.2)',
      lineColor: 'rgba(78, 46, 75, 1)',
    };
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });
    chart.timeScale().fitContent();
    chart.applyOptions(chartOptions);
    serie = chart.addAreaSeries();
    serie.setData(data);
    serie.applyOptions(serieOptions);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [data]);
  useEffect(() => {
    // console.log('actualPrice');
    if (!data.length > 0) return;
    let newData = [...data];
    let lastdata = newData[newData.length - 1];
    if (lastdata.time >= actualPrice.time) return;
    newData[newData.length - 1] = actualPrice;
    serie.setData(newData);
    console.log(actualPrice);
  }, [actualPrice]);
  return <div ref={chartContainerRef} className="chart" />;
};
export default App;