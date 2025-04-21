"use client";

import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { taskMiddleware } from "react-palm/tasks";
import KeplerGl from "@kepler.gl/components";
import { addDataToMap } from "@kepler.gl/actions";
import keplerGlReducer from "@kepler.gl/reducers";

// 配置 Redux Store
const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

// 创建一个新的store
const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

// 定义字段类型
interface Field {
  name: string;
  format: string;
  type: string;
}

// 定义基础数据类型
interface BasicData {
  fields: Field[];
  rows: Array<Array<number>>;
}

// 定义高级数据类型
interface AdvancedData {
  districtsData: {
    fields: Field[];
    rows: Array<Array<unknown>>;
  };
  poiData: {
    fields: Field[];
    rows: Array<Array<unknown>>;
  };
  flowData: {
    fields: Field[];
    rows: Array<Array<unknown>>;
  };
  mapConfig: {
    version: string;
    config: Record<string, unknown>;
  };
}

interface KeplerComponentProps {
  activeTab: string;
  basicData: BasicData;
  advancedData: AdvancedData;
}

export default function KeplerComponent({
  activeTab,
  basicData,
  advancedData
}: KeplerComponentProps) {
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // 监听窗口大小变化
  useEffect(() => {
    // 初始化时设置尺寸
    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        const containerEl = document.querySelector('.border.rounded-lg');
        if (containerEl) {
          setDimensions({
            width: containerEl.clientWidth,
            height: 600
          });
        }
      }
    };
    
    // 立即执行一次
    updateDimensions();
    
    // 添加窗口大小变化监听
    if (typeof window !== "undefined") {
      window.addEventListener('resize', updateDimensions);
      
      // 清理函数
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);

  useEffect(() => {
    // 通常应该从环境变量获取，这里使用临时令牌
    // 注意：在实际应用中，您应该使用自己的 Mapbox 令牌
    setMapboxToken("pk.eyJ1IjoieGR6aGFuZyIsImEiOiJjanpvMDhzbHkwNHRsM21xZTRoMWNrNGtlIn0.GjknvsIiCkUwiQXHG4zGXg");
    
    // 设置标志表示已加载
    setMapLoaded(true);
  }, []);

  useEffect(() => {
    if (mapLoaded && mapboxToken) {
      if (activeTab === "basic") {
        // 加载基础数据
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (store.dispatch as any)(
          addDataToMap({
            datasets: {
              info: {
                label: "北京出租车示例数据",
                id: "beijing_taxi_trips"
              },
              data: basicData
            },
            options: {
              centerMap: true,
              readOnly: false
            },
            config: {
              visState: {
                filters: []
              }
            }
          })
        );
      } else if (activeTab === "advanced") {
        // 加载高级数据和配置
        const { districtsData, poiData, flowData, mapConfig } = advancedData;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (store.dispatch as any)(
          addDataToMap({
            datasets: [
              {
                info: {
                  label: "北京兴趣点",
                  id: "beijing_poi"
                },
                data: poiData
              },
              {
                info: {
                  label: "北京行政区划",
                  id: "beijing_districts"
                },
                data: districtsData
              },
              {
                info: {
                  label: "北京流向数据",
                  id: "beijing_flow"
                },
                data: flowData
              }
            ],
            options: {
              centerMap: true,
              readOnly: false
            },
            config: mapConfig.config
          })
        );
      }
    }
  }, [mapLoaded, mapboxToken, activeTab, basicData, advancedData]);

  return (
    <div className="border rounded-lg" style={{ height: "600px" }}>
      {mapboxToken ? (
        <Provider store={store}>
          <KeplerGl
            id="beijing-map"
            mapboxApiAccessToken={mapboxToken}
            width={dimensions.width}
            height={dimensions.height}
          />
        </Provider>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">正在加载地图...</p>
        </div>
      )}
    </div>
  );
} 