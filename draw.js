import {Players} from './players.js'
export class Draw{
    constructor(arrActivePlayers){
        this.arrActivePlayers = arrActivePlayers;
        this.arrAllPlayers = new Players().players;
        this.teamNumber = null;
        this.drawBtn = document.querySelector('.draw');
        this.comparedArr = null;
        this.arrTeams=null;
        this.teamsSkillRates = [];

        this.showResults()
    }
    showResults(){
        this.drawBtn.addEventListener('click', e=>{
            //zaciągnięcie danych z inputa
            this.teamNumber=Math.floor(document.querySelector('.setup-form-input').value);
            //zabezpieczenie przed pustym inputem
            if(this.teamNumber==="")return window.alert('Give me information about number of teams 😎');
            //zabezpieczeniem przed zbyt małym inputem
            if (this.teamNumber<2) return window.alert(`There is no sense of draw 🤔 Please put 2 teams at least, and remember that I accept only integers, can you imagine half of team?😜`);
            //wywołanie funkcji korelacyjnej wielkie tablice
            this.compare(this.arrActivePlayers, this.arrAllPlayers);
            //wywołanie funkcji drawingAlgorithm
            this.drawingAlgorithm(this.comparedArr, this.teamNumber)
            
        })       
    }
    compare(active, all){
        const activeNames = active.map(el=> el.name);
        const comparedArr = [];
        for(const item of all){
            if(activeNames.includes(item.name)){
                const obj = {};
                obj.name = item.name;
                obj.position = item.position;
                obj.skillRate = item.skillRate;
                comparedArr.push(obj);   
            }
        }
        return this.comparedArr = comparedArr;
    }
    drawingAlgorithm(arr, teams){
        //ustalenie czy będzie zawodnik dodatkowy 1=tak || 0=nie.
        const additionalPlayer = arr.length/teams%2>0 ? 1 : 0;
        //ustalenie ilości zawodników w drużynie na podstawie liczby drużyn i ilości aktywnych zaw.
        const playersInTeam = Math.floor(arr.length/teams);
        //podzielenie graczy na poszczególne tablice
        const posG = arr.filter(el=>el.position==='G');
        const posD = arr.filter(el=>el.position==='D');
        const posA = arr.filter(el=>el.position==='A');

        //główna tablica  do przechowująca drużyny
        const arrTeams=[];
        this.arrTeams = arrTeams;
        //utworzenie drużyn dla Tablicy arrTeams
        this.teamCreator(teams); //zwraca do arrTeams odp ilość podtablic w formacie [team1, [squad...]]
        //ustalenie ile max 'G', 'D', 'A' może być w squadzie
        const maxGInSquad = this.maxPosInSquad(posG,teams);
        const maxDInSquad = this.maxPosInSquad(posD,teams);
        const maxAInSquad = this.maxPosInSquad(posA,teams);
        // rozdzielenie (crossing) zawodników do osobnych drużyn
        this.crossing(teams, posA, posD, posG);
        console.log(this.arrTeams);

        //obliczenie avg drużyn
        let itAvg = 0;
        for(const team of this.arrTeams){
            this.teamSkillRating(this.arrTeams, itAvg);
            itAvg++
        }
        //sprawdzenie średnich odchyleń w średnich
        if(this.teamSkillDif(this.teamsSkillRates)<5){
            return console.log(`koniec ;D`);
        }else{
            this.balancingFirst(this.teamsSkillRates, this.arrTeams)
        }
        

    }
    teamCreator(numberOfTeams){
        for(let i=0; i<numberOfTeams;i++){
            const team = [];
            const name = `Team ${i+1}`;
            const squad = [];
            team.push(name);
            team.push(squad);
            this.arrTeams.push(team)
        }
    }
    randomizer(max){
        return Math.floor(Math.random()*(max-0+1))+0;
    }
    checkHowManyPosAlreadyInTeam(arr, position, maxPosInSquad){
        for(const el of arr){
            const countPlayersAtThePosition = el[1].filter(item=>item.position=== position).length
            if(countPlayersAtThePosition>maxPosInSquad){
                return 'nok';
            }else{
                return 'ok';
            }
        }    
    }
    deletePlayerFromArr(arr, index){
        return arr.splice(index, 1)
    }
    maxPosInSquad(posArr, numberOfTeams){
        return Number.isInteger(posArr.length/numberOfTeams) ? posArr.length/numberOfTeams : Math.floor(posArr.length/numberOfTeams)+1;
    }
    crossing(numberOfTeams, posA, posD, posG){
        let iterator = 0;
        let teamIndexs = [];
        for(let i=0; i<numberOfTeams; i++){
            const index = i;
            teamIndexs.push(index)
        }
        while(posA.length){
            if(numberOfTeams>iterator){
                const random = this.randomizer(teamIndexs.length-1);
                this.arrTeams[teamIndexs[random]][1].push(posA[0])
                posA.shift();
                this.deletePlayerFromArr(teamIndexs, random);
                iterator++
            }else{
                iterator=0;
                for(let i=0; i<numberOfTeams; i++){
                    const index = i;
                    teamIndexs.push(index)
                }
            }
        }
        while(posD.length){
            if(numberOfTeams>iterator){
                const random = this.randomizer(teamIndexs.length-1);
                this.arrTeams[teamIndexs[random]][1].push(posD[0])
                posD.shift();
                this.deletePlayerFromArr(teamIndexs, random);
                iterator++
            }else{
                iterator=0;
                for(let i=0; i<numberOfTeams; i++){
                    const index = i;
                    teamIndexs.push(index)
                }
            }
        }
        while(posG.length){
            if(numberOfTeams>iterator){
                const random = this.randomizer(teamIndexs.length-1);
                this.arrTeams[teamIndexs[random]][1].push(posG[0])
                posG.shift();
                this.deletePlayerFromArr(teamIndexs, random);
                iterator++
            }else{
                iterator=0;
                for(let i=0; i<numberOfTeams; i++){
                    const index = i;
                    teamIndexs.push(index)
                }
            }
        }

    }
    teamSkillRating(arrTeams, whichTeam){
        const sRofTeam = [];
        arrTeams[whichTeam][1].forEach(el=>sRofTeam.push(el.skillRate));
        const avg =((sRofTeam.reduce((prev, next)=> prev * 1 + next * 1) / (arrTeams[whichTeam][1].length * 4))*100).toFixed(1);
        this.teamsSkillRates.push(Number(avg));
        console.log(avg);
        return avg
    }
    teamSkillDif(teamSkillArr){
        const max = Math.max(...teamSkillArr);
        const min = Math.min(...teamSkillArr);
        const maxIndex = teamSkillArr.indexOf(max);
        const minIndex = teamSkillArr.indexOf(min);
        console.log(max, min);
        console.log(maxIndex, minIndex);
        return max-min;
    }
    balancingFirst(teamSkillArr, arrTeams){
        const max = Math.max(...teamSkillArr);
        const min = Math.min(...teamSkillArr);
        const maxIndex = teamSkillArr.indexOf(max);
        const minIndex = teamSkillArr.indexOf(min);

        const bestTeam = arrTeams[maxIndex][1];
        const worstTeam = arrTeams[minIndex][1];

        const minSrInWorstTeam = worstTeam.map(el=>el.skillRate)
                                              .sort((a,b)=>{return a-b})[0];
        const indexOfminSrInWorstTeam = worstTeam.indexOf(worstTeam.find(el=>el.skillRate===minSrInWorstTeam));
        const worstPlayer = worstTeam[indexOfminSrInWorstTeam]; //jako obiekt
        console.log(minSrInWorstTeam, worstPlayer);
        //znalezienie gościa o jeden lepszego niż  najgorszy
    }
}


