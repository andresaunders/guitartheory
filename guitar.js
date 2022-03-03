

/*
    Chromatic scale 
    Major Scale  
    Modal Scale
    Number view 

*/
let cssVar = new CSSGlobalVariables();

let key_num_map = {0:'C', 1:'C#', 2:'D', 3: 'D#', 4: 'E', 5: 'F', 6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B'};

let num_key_map = setNumKeyMap();

let black_notes = new Set([1,3,6,8,10]);

let white_notes = new Set([0,2,4,5,7,9,11]);

let major_scale = [0,2,4,5,7,9,11];

let unselected_note_color = 'rgb(146, 72, 72)';

let major_modes_map = {
    'ionian': 0,
    'dorian': 1,
    'phrygian': 2,
    'lydian': 3,
    'mixolydian': 4,
    'aeolian': 5,
    'locrian': 6
};

let major_modes = setModes(major_scale, major_modes_map);

let scale_color_map = {
    0: '#34ebd8',
    1: '#34eb74',
    2: '#3493eb',
    3: '#3aeb34',
    4: '#344ceb',
    5: '#34ebb7',
    6: '#bd34eb',
    '-1': unselected_note_color
}


let standard_tuning = [4, 9, 2, 7, 11, 4]//E A D G B E

let markers = new Set([3,5,7,9,12]);

let current_fretboard = 0;

let standard_settings = {
    fretboard_id: null,
    tuning: standard_tuning,
    key: 'C', 
    scale: major_scale, 
    mode_name: 'ionian',
    show_scale_degree: false,
    show_non_scale: false
}

let fretboard_settings = []
//key is a num
function transposeScale(key, scale){

    console.log('scale: ', scale);

    let transposed = scale.map(note => { 
        
        console.log('note: ', note);

        console.log('key: ', key);

        let transposed_note = (parseInt(note) + parseInt(key)) % 12;

        console.log('transposed_note: ', transposed_note);

        return transposed_note
    })

    return transposed;
}

function setNumKeyMap(){

    let map = {};

    for(let index in key_num_map){

        map[key_num_map[index]] = index;
    }

    return map;
}

function setModes(scale, mode_map){

    let modes = [];

    for(let mode_name in mode_map){

        modes.push(setMode(mode_name, scale));
    }

    return modes;
}

function setMode(name, scale){

    let mode_num = major_modes_map[name];

    let mode = [];

    for(let i = mode_num; i < mode_num + scale.length; i++){

        mode.push(scale[i % scale.length]);
    }

    return mode;
}

function getScaleDegree(note, scale){

    for(let i = 0; i < scale.length; i++){

        if(scale[i] == note){

            return (i + 1);
        }
    }

    return null;
}

function getNextInterval(tuning, index){

    if(index < 0){

        index += tuning.length
    }

    console.log('index: ', index, ', index + 1: ', (index + 1) % tuning.length)

    let next_interval = tuning[(index + 1) % tuning.length] - tuning[index];

    console.log('next interval: ', next_interval);

    return next_interval
}

function createFretboard(settings){

    console.log('freboard_settings length: ', fretboard_settings.length);

    settings.fretboard_id = fretboard_settings.length;
    fretboard_settings.push(settings);
    let tuning = settings.tuning;
    let scale = settings.scale;
    let show_scale_degree = settings.show_scale_degree;

    let fretboard_layout = document.createElement('div');

    fretboard_layout.classList.add('fretboard-layout')

    let fretboard_container = document.createElement('div');

    fretboard_container.classList.add('fretboard-container');

    let tuning_display = document.createElement('div');

    tuning_display.classList.add('tuning');

    showTuning(tuning_display, tuning);

    let fretboard = document.createElement('div');

    fretboard.classList.add('fretboard');

    let num_fretboards = document.querySelectorAll('.fretboard').length;

    fretboard.id = `fretboard-${num_fretboards}`;

    let new_option = document.createElement('option');

    new_option.value = num_fretboards;

    new_option.textContent = num_fretboards + 1;

    document.getElementById('fretboard-selection').appendChild(new_option);

    createBars(settings, fretboard);

    fretboard_container.appendChild(tuning_display);

    fretboard_container.appendChild(fretboard);

    fretboard_layout.appendChild(fretboard_container);

    document.body.appendChild(fretboard_layout);
}

function showTuning(tuning_display, tuning){

    console.log('tuning_display: ', tuning_display)

    let unit_height = cssPropertyToNumber(cssVar['--fretboard-height'])/6;

    for(let i = tuning.length-1; i >= 0; i--){

        let tuning_note_display = document.createElement('div');

        tuning_note_display.classList.add('tuning-note-container')

        tuning_note_display.textContent = key_num_map[tuning[i]];

        tuning_display.appendChild(tuning_note_display);
    }

    //console.log('unit_height: ', unit_height);
}

function noteColor(note, note_div, scale){

    console.log('note: ', note, ', scale: ', scale);

    let scale_degree = getScaleDegree(note, scale);

    console.log('scale_degree: ', scale_degree);

    note_div.style.backgroundColor = scale_color_map[scale_degree-1];
}

function createBars(settings, fretboard){

    console.log('settings; ', settings);

    let tuning = settings.tuning;
    let scale = settings.scale;
    let show_scale_degree = settings.show_scale_degree;
    let show_non_scale = settings.show_non_scale;

    for(let i = 1; i <= 12; i++){

        let bar_container = document.createElement('div');

        bar_container.classList.add('bar-container');

        let fraction = 0.96;

        let bar_width = 100;

        for(let j = tuning.length - 1; j >= 0; j--){

            let in_scale = true;

            let bar_note_container = document.createElement('div');

            bar_note_container.classList.add('bar-note-container');

            if(j == tuning.length - 1){

                bar_note_container.style.borderTop = '1px solid black';
            }
            if(i == 1){

                bar_note_container.style.borderLeft = '1px solid black';
            }

            let root = (tuning[j] + i) % 12;

            if(!scale.includes(root)){

                in_scale = false;
            }

            bar_note_container.classList.add(

                scale.includes(root) ? 'white-note' : 'black-note'
            )


            console.log('root: ', root);

           // let note_index = (root + getNextInterval(tuning, j-1)) % 12;

            //console.log('note_index: ', note_index%12)

            //let note_index = (tuning_interval + i) % 12;

            let bar_note = !in_scale && !show_non_scale ?  null : key_num_map[root]

            noteColor(root, bar_note_container, scale);

            bar_note_container.textContent = show_scale_degree ? getScaleDegree(root, scale) : bar_note;

            bar_note_container.id = `${fretboard.id}-${i}-${j}`;

            console.log('i: ', i,', j: ', j,', note: ', bar_note);

            bar_note_container.style.width = (bar_width * Math.pow(fraction, i - 1)) + 'px';

            bar_container.appendChild(bar_note_container);
        }

        let marker = document.createElement('div');

        if(markers.has(i)){
            
            marker.classList.add('fretboard-marker');

            if(i == 12){

                marker.style.backgroundColor = 'royalblue';
            }
        }
        else {
            marker.classList.add('fretboard-marker-spacer');
        }

        bar_container.appendChild(marker);

        fretboard.appendChild(bar_container);
    }
}

function getFretboardNum(fretboard){

    return fretboard.id.substring(10);
}

function setBarNotes(settings){

    let fretboard_id = settings.fretboard_id;
    let tuning = settings.tuning;
    let scale = settings.scale;
    let key = settings.key;
    let show_scale_degree = settings.show_scale_degree;
    let show_non_scale = settings.show_non_scale;

    key = num_key_map[key];

    console.log('key: ', key);

    if(key != 0){

        scale = transposeScale(key, scale);
    }

    console.log('scale: ', scale);

    let fretboard = document.getElementById(`fretboard-${fretboard_id}`);

    for(let i = 1; i <= 12; i++){

        for(let j = tuning.length - 1; j >= 0; j--){


            let bar_note_container = fretboard.querySelector(`#${fretboard.id}-${i}-${j}`);

            let root = (tuning[j] + i) % 12;

            bar_note_container.classList.add(

                scale.includes(root) ? 'white-note' : 'black-note'
            )

            bar_note_container.classList.remove(

                scale.includes(root) ? 'black-note' : 'white-note'
            )

            console.log('root: ', root);

            let bar_note = key_num_map[root];

            noteColor(root, bar_note_container, scale);

            bar_note_container.textContent = show_scale_degree ? getScaleDegree(root, scale) : bar_note;

            console.log('i: ', i,', j: ', j,', note: ', bar_note);

        }
    }
}


function cssPropertyToNumber(property){

    console.log('property: ', property)
    let s = '';

    for(let char of property){

        console.log('char: ', char);

        if(isNaN(char)){
            break;
        }
        
        s += char;
    }

    return parseInt(s);
}

function isNumber(string){

    return !isNaN(string);
}

function createNumberedFretboard(key){

}

function main(){

    createFretboard(copySettings(standard_settings));
}

function copySettings(settings){

    return JSON.parse(JSON.stringify(settings))
}

main();