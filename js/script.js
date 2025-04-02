document.addEventListener('alpine:init', () => {
    Alpine.store('level', {
        on: false,
        toggle(){
            this.on = ! this.on
        }
    })
});

function checkLevel() {
    return {

        level_0:'', level_1:'', level_2:'', level_3:'', level_4:'', level_5:'', level_6:'', level_7:'', level_8:'', level_9:'', level_10:'', level_11:'', level_12:'', level_13:'', level_14:'', level_15:'', level_16:'', level_17:'', level_18:'', level_19:'', level_20:'', level_21:'', level_22:'', level_23:'', level_24:'',

        levels : [
            {
                level:"0",
                answer:[
                    {'': '',status:false}
                ]
            },
            {
                level:"1",
                answer:[
                    {'justify-content': 'flex-end',status:false}
                ]
            },
            {
                level:"2",
                answer:[
                    {'justify-content': 'center',status:false}
                ]
            },
            {
                level:"3",
                answer:[
                    {'justify-content': 'space-around',status:false},
                ]
            },
            {
                level:"4",
                answer:[
                    {'justify-content': 'space-between',status:false},
                ]
            },
            {
                level:"5",
                answer:[
                    {'align-items': 'flex-end',status:false}
                ]
            },
            {
                level:"6",
                answer:[
                    {'justify-content': 'center',status:false},
                    {'align-items': 'center',status:false}
                ]
            },
            {
                level:"7",
                answer:[
                    {'justify-content': 'space-around',status:false},
                    {'align-items': 'flex-end',status:false}
                ]
            },
            {
                level:"8",
                answer:[
                    {'flex-direction': 'row-reverse',status:false}
                ]
            },
            {
                level:"9",
                answer:[
                    {'flex-direction': 'column',status:false}
                ]
            },
            {
                level:"10",
                answer:[
                    {'flex-direction': 'row-reverse',status:false},
                    {'justify-content': 'flex-end',status:false}
                ]
            },
            {
                level:"11",
                answer:[
                    {'flex-direction': 'column',status:false},
                    {'justify-content': 'flex-end',status:false},
                    {'align-items': 'flex-start',status:false}
                ]
            },
            {
                level:"12",
                answer:[
                    {'flex-direction': 'column-reverse',status:false},
                    {'justify-content': 'space-between',status:false}
                ]
            },
            {
                level:"13",
                answer:[
                    {'flex-direction': 'row-reverse',status:false},
                    {'justify-content': 'center',status:false},
                    {'align-items': 'flex-end',status:false}
                ]
            },
            {
                level:"14",
                answer:[
                    {'order': '1',status:false}
                ]
            },
            {
                level:"15",
                answer:[
                    {'order': '-1',status:false}
                ]
            },
            {
                level:"16",
                answer:[
                    {'align-self': 'flex-end',status:false}
                ]
            },
            {
                level:"17",
                answer:[
                    {'align-self': 'flex-end',status:false},
                    {'order': '2',status:false}
                ]
            },
            {
                level:"18",
                answer:[
                    {'flex-wrap': 'wrap',status:false}
                ]
            },
            {
                level:"19",
                answer:[
                    {'flex-direction': 'column',status:false},
                    {'flex-wrap': 'wrap',status:false}
                ]
            },
            {
                level:"20",
                answer:[
                    {'flex-flow': 'column wrap',status:false}
                ]
            },
            {
                level:"21",
                answer:[
                    {'align-content': 'flex-start',status:false},
                    {'align-items': 'flex-end',status:false}
                ]
            },
            {
                level:"22",
                answer:[
                    {'align-content': 'flex-end',status:false}
                ]
            },
            {
                level:"23",
                answer:[
                    {'flex-direction': 'column-reverse',status:false},
                    {'align-content': 'center',status:false}
                ]
            },
            {
                level:"24",
                answer:[
                    {'flex-direction': 'column-reverse',status:false},
                    {'flex-wrap': 'wrap-reverse',status:false},
                    {'align-content': 'space-between',status:false},
                    {'justify-content': 'center',status:false}
                ]
            },
        ],
        check(attempt, level) {
            var level_current = '';
            levelcurrent = level;

            var arraytext = attempt.split("\n")
            var answerlevel = this.levels[levelcurrent].answer;
            var answerarray = JSON.parse(JSON.stringify(answerlevel));
            if(arraytext.length <= answerarray.length){
                var search = []
                var stay = true

                for (var i = 0; i < arraytext.length; i++) {
                    if(i!=arraytext.length-1){
                        var lastchar = arraytext[i].substring(arraytext[i].length - 1)
                        if(lastchar == ";" && stay == true){
                            search.push(arraytext[i].split(':')[0]);
                        } else {
                            stay = false
                        }
                    } else {
                        if(stay == true){
                            search.push(arraytext[i].split(':')[0]);
                        }
                    }
                }

                for(const [v, answer] of answerarray.entries()){
                    var answera = Object.entries(answer)
                    var key = answera[0][0]
                    var value = answera[0][1]
                    if(search.includes(key)){
                        var index = search.indexOf(key);
                        var stringanswer = key+": "+value+";"
                        var newregex = new RegExp( "^\\b"+stringanswer.replace(/(: |:)/i,'(: |:)').replace(/;/i,'(;|)')+"$", "g" )
                        var checkRegex = newregex.test(arraytext[index]);
                        if(checkRegex==true){
                            this.levels[levelcurrent].answer[v].status = true;
                        }else {
                            this.levels[levelcurrent].answer[v].status = false;
                        }
                    } else {
                        this.levels[levelcurrent].answer[v].status = false;
                    }
                }
            }
        }
    }
}

function counter() {
    return {
        count: 1,
        increment() {
            if(this.count < 24) {
                const current = Number(document.getElementById('current').innerText)+1
                this.count++;
                this.$refs.status.innerText = current
            }
        },
        decrement() {
            if(this.count > 1) {
                const current = Number(document.getElementById('current').innerText)-1
                this.count--;
                this.$refs.status.innerText = this.count
            }
        },
        level(levelClick){
            const levels = document.getElementsByClassName('level');
            const current = document.getElementById('current');
            level_current = levelClick.event.target.innerText;
            current.innerText = level_current;
            level.innerText = level_current;
            this.count = level_current
        }
    };
}