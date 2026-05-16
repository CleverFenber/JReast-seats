const fs = require('fs');

const touhoku = JSON.parse(fs.readFileSync('data/geojson/shinkansen/shin-tohoku.json'));
const akita = JSON.parse(fs.readFileSync('data/geojson/shinkansen/shin-akita.json'));

// 모리오카(위도 39.7014) 이남만 통과 — 도쿄~모리오카 구간
const MAX_LAT = 39.72;

const filtered = touhoku.features.filter(feat => {
  if (!feat.geometry) return false;
  const coords = feat.geometry.type === 'LineString'
    ? feat.geometry.coordinates
    : feat.geometry.type === 'MultiLineString'
    ? feat.geometry.coordinates.flat()
    : [];
  // 모든 좌표가 모리오카 이남에 있는 feature만 통과
  return coords.length > 0 && coords.every(([lng, lat]) => lat <= MAX_LAT);
});

const merged = {
  type: 'FeatureCollection',
  features: [...filtered, ...akita.features]
};

fs.writeFileSync('data/geojson/shinkansen/shin-akita-full.json', JSON.stringify(merged));
console.log(`완료! 도호쿠 구간 ${filtered.length}개 + 아키타 ${akita.features.length}개`);