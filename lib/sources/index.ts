// @/lib/sources/index.ts
// 定义数据源类型
export interface VideoSource {
  id: string; // 源唯一标识
  name: string; // 源名称（如"默认视频源"）
  apiUrl: string; // 接口基础地址
  description?: string; // 源描述
  isDefault: boolean; // 是否为默认源
}

// 初始自定义源（可根据实际需求修改地址）
export const videoSources: VideoSource[] = [
  {
    id: 'default-premium',
    name: '官方高级源',
    apiUrl: 'https://apidanaizi.com/api.php/provide/vod', // 初始默认接口地址
    description: '官方提供的高级视频内容源',
    isDefault: true,
  },
  // 可在此添加更多源...
  // {
  //   id: 'backup-source',
  //   name: '备用源',
  //   apiUrl: 'https://backup.example.com/videos',
  //   isDefault: false,
  // },
];

// 获取默认源
export const getDefaultSource = (): VideoSource => {
  return videoSources.find(source => source.isDefault) || videoSources[0];
};