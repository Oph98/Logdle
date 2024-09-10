export const getColorForClass = (className) => {
    const classColors = {
        hunter: '#ABD473',
        deathknight: '#C41F3B',
        rogue: '#FFF569',
        druid: '#FF7D0A',
        demonhunter: '#A330C9',
        shaman: '#0070DE',
        warlock: '#9482C9',
        mage: '#69CCF0',
        monk: '#00FF96',
        paladin: '#F58CBA',
        warrior: '#C79C6E',
        priest: '#FFFFFF'
    };
    return classColors[className] || '#ffffff';
  };
  
  export const getColorForRank = (rank) => {
    const rankColors = {
      grey: '#9d9d9d',
      green: '#1eff00',
      blue: '#0070dd',
      purple: '#a335ee',
    };
    return rankColors[rank] || '#ffffff';
  };
  
  export const getRandomPlayers = (players, count) => {
    let shuffled = [...players].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  