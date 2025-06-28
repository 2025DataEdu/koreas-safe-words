
export const DISASTER_TERMS: Record<string, string[]> = {
  // 기상 재해
  '태풍': ['typhoon', 'hurricane', 'storm'],
  '풍랑경보': ['storm warning', 'wave warning', 'maritime storm alert'],
  '호우': ['heavy rain', 'torrential rain', 'downpour'],
  '폭우': ['heavy rainfall', 'torrential downpour', 'intense rain'],
  '대설': ['heavy snow', 'snowstorm', 'blizzard'],
  '폭설': ['heavy snowfall', 'snowstorm', 'severe snow'],
  '한파': ['cold wave', 'severe cold', 'arctic blast'],
  '폭염': ['heat wave', 'extreme heat', 'scorching heat'],
  '황사': ['yellow dust', 'sandstorm', 'dust storm'],
  '미세먼지': ['fine dust', 'particulate matter', 'PM2.5'],
  
  // 지질 재해
  '지진': ['earthquake', 'seismic activity', 'tremor'],
  '여진': ['aftershock', 'secondary earthquake', 'seismic aftershock'],
  '산사태': ['landslide', 'landslip', 'slope failure'],
  '지반침하': ['ground subsidence', 'land subsidence', 'ground collapse'],
  '싱크홀': ['sinkhole', 'ground collapse', 'subsidence hole'],
  
  // 화재/폭발
  '화재': ['fire', 'blaze', 'conflagration'],
  '산불': ['wildfire', 'forest fire', 'mountain fire'],
  '폭발': ['explosion', 'blast', 'detonation'],
  '가스누출': ['gas leak', 'gas leakage', 'gas escape'],
  
  // 수해
  '홍수': ['flood', 'flooding', 'inundation'],
  '침수': ['flooding', 'submersion', 'waterlogging'],
  '범람': ['overflow', 'river overflow', 'flood overflow'],
  '쓰나미': ['tsunami', 'tidal wave', 'seismic sea wave'],
  
  // 생물학적 재해
  '감염병': ['infectious disease', 'epidemic', 'pandemic'],
  '조류독감': ['avian influenza', 'bird flu', 'H5N1'],
  '구제역': ['foot-and-mouth disease', 'FMD', 'livestock disease'],
  
  // 사회적 재난
  '테러': ['terrorism', 'terrorist attack', 'terror incident'],
  '사이버공격': ['cyber attack', 'hacking', 'cyber terrorism'],
  '정전': ['power outage', 'blackout', 'power failure'],
  '교통사고': ['traffic accident', 'vehicle collision', 'road accident'],
  
  // 대응 조치
  '대피': ['evacuation', 'evacuate', 'flee'],
  '대피소': ['evacuation center', 'shelter', 'safe zone'],
  '구조': ['rescue', 'relief', 'emergency response'],
  '구급': ['first aid', 'emergency medical', 'paramedic'],
  '봉쇄': ['quarantine', 'lockdown', 'isolation'],
  '통제': ['control', 'restriction', 'regulation'],
  
  // 행정 용어
  '행정명령': ['administrative order', 'government directive', 'official order'],
  '재난선포': ['disaster declaration', 'emergency declaration', 'calamity announcement'],
  '특별재난지역': ['special disaster zone', 'disaster area', 'calamity region'],
  '비상계획': ['emergency plan', 'contingency plan', 'disaster response plan']
};

export const AMBIGUOUS_TERMS: Record<string, { contexts: string[], translations: Record<string, string[]> }> = {
  '전주': {
    contexts: ['지명', '시간'],
    translations: {
      '지명': ['Jeonju (city)', 'Jeonju City'],
      '시간': ['previous week', 'last week', 'week before']
    }
  },
  '수원': {
    contexts: ['지명', '물'],
    translations: {
      '지명': ['Suwon (city)', 'Suwon City'],
      '물': ['water source', 'water supply', 'water origin']
    }
  },
  '광주': {
    contexts: ['전라남도', '경기도'],
    translations: {
      '전라남도': ['Gwangju (metropolitan city)', 'Gwangju Metro City'],
      '경기도': ['Gwangju (Gyeonggi)', 'Gwangju City in Gyeonggi']
    }
  },
  '서울': {
    contexts: ['지명', '동사'],
    translations: {
      '지명': ['Seoul (capital)', 'Seoul City'],
      '동사': ['standing', 'erected', 'established']
    }
  },
  '부산': {
    contexts: ['지명', '동사'],
    translations: {
      '지명': ['Busan (city)', 'Busan Metropolitan City'],
      '동사': ['scattered', 'dispersed', 'broken apart']
    }
  },
  '대구': {
    contexts: ['지명', '명사'],
    translations: {
      '지명': ['Daegu (city)', 'Daegu Metropolitan City'],
      '명사': ['large sphere', 'big ball']
    }
  },
  '인천': {
    contexts: ['지명', '명사'],
    translations: {
      '지명': ['Incheon (city)', 'Incheon Metropolitan City'],
      '명사': ['kind person', 'benevolent individual']
    }
  }
};

export const CULTURAL_CONTEXT_TERMS: Record<string, { explanation: string, translations: Record<string, string> }> = {
  '아파트단지': {
    explanation: '한국의 고층 주거단지 (서구의 apartment와 다른 개념)',
    translations: {
      'en': 'apartment complex',
      'zh': '公寓小区',
      'ja': 'アパート団地',
      'vi': 'khu chung cư',
      'th': 'หมู่บ้านอพาร์ตเมนต์'
    }
  },
  '읍면동': {
    explanation: '한국의 행정구역 단위',
    translations: {
      'en': 'township/village/district',
      'zh': '邑面洞',
      'ja': '邑面洞',
      'vi': 'ấp/xã/phường',
      'th': 'หมู่บ้าน/ตำบล/เขต'
    }
  },
  '119': {
    explanation: '한국의 소방서 긴급신고번호',
    translations: {
      'en': '119 (Fire/Emergency)',
      'zh': '119 (消防急救)',
      'ja': '119番 (消防・救急)',
      'vi': '119 (Cứu hỏa/Cấp cứu)',
      'th': '119 (ดับเพลิง/ฉุกเฉิน)'
    }
  },
  '112': {
    explanation: '한국의 경찰 긴급신고번호',
    translations: {
      'en': '112 (Police Emergency)',
      'zh': '112 (警察报警)',
      'ja': '112番 (警察)',
      'vi': '112 (Cảnh sát khẩn cấp)',
      'th': '112 (ตำรวจฉุกเฉิน)'
    }
  }
};
