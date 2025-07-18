// 北京行政区划数据（简化版GeoJSON坐标，仅用于示例）
export const beijingDistrictsData = {
  fields: [
    { name: "name", format: "", type: "string" },
    { name: "geometry", format: "", type: "geojson" },
    { name: "value", format: "", type: "integer" },
  ],
  rows: [
    [
      "东城区",
      {
        type: "Polygon",
        coordinates: [
          [
            [116.4208, 39.9289],
            [116.439, 39.9289],
            [116.439, 39.908],
            [116.4208, 39.908],
            [116.4208, 39.9289],
          ],
        ],
      },
      85,
    ],
    [
      "西城区",
      {
        type: "Polygon",
        coordinates: [
          [
            [116.366, 39.9289],
            [116.41, 39.9289],
            [116.41, 39.908],
            [116.366, 39.908],
            [116.366, 39.9289],
          ],
        ],
      },
      92,
    ],
    [
      "朝阳区",
      {
        type: "Polygon",
        coordinates: [
          [
            [116.465, 40.0],
            [116.54, 40.0],
            [116.54, 39.92],
            [116.465, 39.92],
            [116.465, 40.0],
          ],
        ],
      },
      76,
    ],
    [
      "海淀区",
      {
        type: "Polygon",
        coordinates: [
          [
            [116.28, 40.03],
            [116.36, 40.03],
            [116.36, 39.95],
            [116.28, 39.95],
            [116.28, 40.03],
          ],
        ],
      },
      88,
    ],
    [
      "丰台区",
      {
        type: "Polygon",
        coordinates: [
          [
            [116.28, 39.88],
            [116.36, 39.88],
            [116.36, 39.82],
            [116.28, 39.82],
            [116.28, 39.88],
          ],
        ],
      },
      67,
    ],
    [
      "石景山区",
      {
        type: "Polygon",
        coordinates: [
          [
            [116.18, 39.93],
            [116.26, 39.93],
            [116.26, 39.88],
            [116.18, 39.88],
            [116.18, 39.93],
          ],
        ],
      },
      72,
    ],
  ],
};

// 模拟北京地区POI数据
export const beijingPOIData = {
  fields: [
    { name: "name", format: "", type: "string" },
    { name: "longitude", format: "", type: "real" },
    { name: "latitude", format: "", type: "real" },
    { name: "category", format: "", type: "string" },
    { name: "rating", format: "", type: "real" },
  ],
  rows: [
    ["故宫博物院", 116.3972, 39.9154, "景点", 4.9],
    ["天安门广场", 116.3977, 39.9073, "景点", 4.8],
    ["颐和园", 116.2755, 39.9988, "景点", 4.7],
    ["北京大学", 116.3119, 39.9869, "教育", 4.9],
    ["清华大学", 116.3304, 39.9996, "教育", 4.9],
    ["王府井", 116.4156, 39.9153, "购物", 4.5],
    ["三里屯", 116.4546, 39.9387, "购物", 4.4],
    ["中关村", 116.3177, 39.9808, "科技", 4.6],
    ["国家体育场鸟巢", 116.3901, 39.9929, "体育", 4.7],
    ["北京首都国际机场", 116.5914, 40.0746, "交通", 4.3],
    ["北京南站", 116.3803, 39.8651, "交通", 4.4],
    ["北京西站", 116.3227, 39.8954, "交通", 4.3],
    ["后海", 116.3883, 39.9442, "休闲", 4.6],
    ["798艺术区", 116.4948, 39.9847, "艺术", 4.5],
    ["朝阳公园", 116.4836, 39.9421, "公园", 4.4],
  ],
};

// 模拟北京到其他城市的流向数据
export const beijingFlowData = {
  fields: [
    { name: "origin_city", format: "", type: "string" },
    { name: "origin_lon", format: "", type: "real" },
    { name: "origin_lat", format: "", type: "real" },
    { name: "dest_city", format: "", type: "string" },
    { name: "dest_lon", format: "", type: "real" },
    { name: "dest_lat", format: "", type: "real" },
    { name: "count", format: "", type: "integer" },
  ],
  rows: [
    ["北京", 116.4074, 39.9042, "上海", 121.4737, 31.2304, 1250],
    ["北京", 116.4074, 39.9042, "广州", 113.2644, 23.1291, 950],
    ["北京", 116.4074, 39.9042, "深圳", 114.0579, 22.5431, 870],
    ["北京", 116.4074, 39.9042, "成都", 104.0665, 30.5723, 760],
    ["北京", 116.4074, 39.9042, "杭州", 120.1551, 30.2741, 680],
    ["北京", 116.4074, 39.9042, "武汉", 114.3055, 30.5928, 580],
    ["北京", 116.4074, 39.9042, "西安", 108.9402, 34.3415, 520],
    ["北京", 116.4074, 39.9042, "重庆", 106.5516, 29.563, 490],
    ["北京", 116.4074, 39.9042, "南京", 118.7969, 32.0603, 470],
    ["北京", 116.4074, 39.9042, "天津", 117.201, 39.0842, 420],
  ],
};

// 为 Kepler.gl 准备自定义配置
export const customMapConfig = {
  version: "v1",
  config: {
    visState: {
      filters: [],
      layers: [
        {
          id: "poi",
          type: "point",
          config: {
            dataId: "beijing_poi",
            label: "北京兴趣点",
            color: [18, 147, 154],
            columns: {
              lat: "latitude",
              lng: "longitude",
              altitude: null,
            },
            isVisible: true,
            visConfig: {
              radius: 10,
              fixedRadius: false,
              opacity: 0.8,
              outline: false,
              thickness: 2,
              colorRange: {
                name: "Global Warming",
                type: "sequential",
                category: "Uber",
                colors: [
                  "#5A1846",
                  "#900C3F",
                  "#C70039",
                  "#E3611C",
                  "#F1920E",
                  "#FFC300",
                ],
              },
              radiusRange: [0, 50],
              "hi-precision": false,
            },
          },
          visualChannels: {
            colorField: {
              name: "rating",
              type: "real",
            },
            colorScale: "quantile",
            sizeField: {
              name: "rating",
              type: "real",
            },
            sizeScale: "sqrt",
          },
        },
        {
          id: "flow",
          type: "arc",
          config: {
            dataId: "beijing_flow",
            label: "北京出行流向",
            color: [231, 159, 213],
            columns: {
              lat0: "origin_lat",
              lng0: "origin_lon",
              lat1: "dest_lat",
              lng1: "dest_lon",
            },
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              thickness: 2,
              colorRange: {
                name: "Uber Viz Qualitative 4",
                type: "qualitative",
                category: "Uber",
                colors: [
                  "#12939A",
                  "#DDB27C",
                  "#88572C",
                  "#FF991F",
                  "#F15C17",
                  "#223F9A",
                  "#DA70BF",
                  "#125C77",
                  "#4DC19C",
                  "#776E57",
                  "#17B8BE",
                  "#F6D18A",
                  "#B7885E",
                  "#FFCB99",
                  "#F89570",
                  "#829AE3",
                  "#E79FD5",
                  "#1E96BE",
                  "#89DAC1",
                  "#B3AD9E",
                ],
              },
              sizeRange: [0, 10],
              targetColor: null,
            },
            visualChannels: {
              colorField: null,
              colorScale: "quantize",
              sizeField: {
                name: "count",
                type: "integer",
              },
              sizeScale: "linear",
            },
          },
        },
        {
          id: "districts",
          type: "geojson",
          config: {
            dataId: "beijing_districts",
            label: "北京行政区域",
            color: [241, 92, 23],
            columns: {
              geojson: "geometry",
            },
            isVisible: true,
            visConfig: {
              opacity: 0.2,
              strokeOpacity: 0.8,
              thickness: 0.5,
              strokeColor: [80, 100, 170],
              colorRange: {
                name: "Global Warming",
                type: "sequential",
                category: "Uber",
                colors: [
                  "#5A1846",
                  "#900C3F",
                  "#C70039",
                  "#E3611C",
                  "#F1920E",
                  "#FFC300",
                ],
              },
              strokeColorRange: {
                name: "Global Warming",
                type: "sequential",
                category: "Uber",
                colors: [
                  "#5A1846",
                  "#900C3F",
                  "#C70039",
                  "#E3611C",
                  "#F1920E",
                  "#FFC300",
                ],
              },
              radius: 10,
              sizeRange: [0, 10],
              radiusRange: [0, 50],
              heightRange: [0, 500],
              elevationScale: 5,
              stroked: true,
              filled: true,
              enable3d: false,
              wireframe: false,
            },
            visualChannels: {
              colorField: {
                name: "value",
                type: "integer",
              },
              colorScale: "quantile",
              sizeField: null,
              sizeScale: "linear",
              strokeColorField: null,
              strokeColorScale: "quantile",
              heightField: null,
              heightScale: "linear",
              radiusField: null,
              radiusScale: "linear",
            },
          },
        },
      ],
      interactionConfig: {
        tooltip: {
          fieldsToShow: {
            beijing_poi: [
              {
                name: "name",
                format: null,
              },
              {
                name: "category",
                format: null,
              },
              {
                name: "rating",
                format: null,
              },
            ],
            beijing_flow: [
              {
                name: "origin_city",
                format: null,
              },
              {
                name: "dest_city",
                format: null,
              },
              {
                name: "count",
                format: null,
              },
            ],
            beijing_districts: [
              {
                name: "name",
                format: null,
              },
              {
                name: "value",
                format: null,
              },
            ],
          },
          compareMode: false,
          compareType: "absolute",
          enabled: true,
        },
        brush: {
          size: 0.5,
          enabled: false,
        },
        geocoder: {
          enabled: false,
        },
        coordinate: {
          enabled: false,
        },
      },
      layerBlending: "normal",
      splitMaps: [],
      animationConfig: {
        currentTime: null,
        speed: 1,
      },
    },
    mapState: {
      bearing: 0,
      dragRotate: false,
      latitude: 39.9042,
      longitude: 116.4074,
      pitch: 0,
      zoom: 9,
      isSplit: false,
    },
    mapStyle: {
      styleType: "dark",
      topLayerGroups: {},
      visibleLayerGroups: {
        label: true,
        road: true,
        border: false,
        building: true,
        water: true,
        land: true,
        "3d building": false,
      },
      threeDBuildingColor: [9.196, 9.196, 9.196],
      mapStyles: {},
    },
  },
};
