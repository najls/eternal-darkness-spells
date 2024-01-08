const spells = {
    'enchant': ['antorbok', 'magormor'],
    'recover': ['narokath', 'santak'],
    'reveal': ['narokath', 'redgormor'],
    'field': ['bankorok', 'redgormor'],
    'dispel': ['nethlek', 'redgormor'],
    'summon': ['tier', 'aretak'],
    'shield': ['bankorok', 'santak'],
    'attack': ['antorbok', 'redgormor'],
    'pool': ['tier', 'redgormor'],
    'bind': ['bankorok', 'aretak']
};
const entities = document.querySelectorAll('.rune, .spell');

document.getElementById('name').addEventListener('click', toggleDisplay);
document.getElementById('translate').addEventListener('click', toggleDisplay);
document.getElementById('reset').addEventListener('click', resetTable);

var add = true;

Array.from(entities).forEach(entity => {
    entity.addEventListener('click', function() {
        /* if a spell has been clicked */
        if (this.dataset.type === 'spell') {
            /* if spell is being deselected */
            if (this.classList.contains('selected')) {
                deselectSpell(this);
            }
            else selectRunes(this);
        }
        /* if a rune has been clicked */
        else {
            this.classList.toggle('selected');
            if (this.dataset.type === 'alignment') setAlignment();
        }
        selectSpells();

        // if (this.classList.toggle('selected')) {
            /* if a spell was selected */
            // if (this.dataset.type === 'spell') {
                // selectRunes(this);
                // changeActive('spell', this);
                // deselectAll('spell', this);
            // }
            /* if any other entity except for pargon was selected */
        //     else if (this.id !== 'pargon') {
        //         if (this.dataset.type === 'alignment') setAlignment();
        //         else selectSpells();
        //     }
        // }
        /* if a spell was deselected */
        // else if (this.dataset.type === 'spell') {
        //     if (document.getElementsByClassName('spell selected').length > 0) {
        //         selectRunes(this);
        //         changeActive('spell', this);
        //         deselectAll('spell');
        //         select(this);
        //     }
        //     else resetTable(false);
        // }
        /* if an alignment was deselected */
        // else if (this.dataset.type === 'alignment') setAlignment();
        /* if any other entity except for pargon was deselected */
        // else if (this.id !== 'pargon') selectSpells();
    });
});

function selectRunes(entity) {
    if (entity.classList.contains('unavailable')) {
        entity.classList.remove('unavailable');
        deselect(document.getElementById('mantorok'));
        setAlignment();
    }
    spells[entity.id].forEach(rune => {
        document.getElementById(rune).classList.add('selected');
    });
    // spells.forEach(spell => {
    //     if (spell[0] === entity.id) {
    //         for (let i = 1; i < spell.length; i++) {
    //             let rune = document.getElementById(spell[i]);
                // rune.classList.add('selected');
                // changeActive(rune.dataset.type, rune);
                // deselectAll(rune.dataset.type, rune);
    //         }
    //     }
    // });
    // let mantorok = document.getElementById('mantorok');
    // if (entity.id === 'summon') {
    //     deselect(mantorok);
    //     mantorok.classList.add('unavailable');
    //     setAlignment();
    // }
    // else mantorok.classList.remove('unavailable');
}

/* when multiple spells are selected, a deselected spell may persist if both of
 * its runes are present in other spells. in that case we deselect both runes
 * to give the user some feedback.
 */
function deselectSpell(entity) {
    /* deselect spell */
    deselect(entity);
    /* deselect both runes of deselected spell */
    spells[entity.id].forEach(rune => { deselect(document.getElementById(rune)); });
    /* reselect runes from other selected spells */
    let selectedSpells = document.getElementsByClassName('spell selected');
    Array.from(selectedSpells).forEach(spell => {
        spells[spell.id].forEach(rune => {
            document.getElementById(rune).classList.add('selected');
        });
    });
    /* if both runes from deselected spell were reselected */
    let selectedRunes = document.getElementsByClassName('rune selected');
    if (spells[entity.id].every(rune => Array.from(selectedRunes).includes(document.getElementById(rune)))) {
        /* deselect both */
        spells[entity.id].forEach(rune => { deselect(document.getElementById(rune)); });
    }

    // spells.forEach(spell => {
    //     if (spell[0] === entity.id) {
    //         for (let i = 1; i < spell.length; i++) {
    //             let rune = document.getElementById(spell[i]);
                // rune.classList.add('selected');
                // changeActive(rune.dataset.type, rune);
                // deselectAll(rune.dataset.type, rune);
    //         }
    //     }
    // });
    // let mantorok = document.getElementById('mantorok');
    // if (entity.id === 'summon') {
    //     deselect(mantorok);
    //     mantorok.classList.add('unavailable');
    //     setAlignment();
    // }
    // else mantorok.classList.remove('unavailable');
}

function selectSpells() {
    let selectedRunes = document.getElementsByClassName('rune selected');
    deselectAll('spell');
    for (const [spell, runes] of Object.entries(spells)) {
        /* if selectedRunes contains all required runes for the spell */
        if (runes.every(rune => Array.from(selectedRunes).includes(document.getElementById(rune)))) {
            if (!document.getElementById(spell).classList.contains('unavailable')) {
                document.getElementById(spell).classList.add('selected');
            }
        }
    }
    if (document.getElementById('summon').classList.contains('selected')) {
        let mantorok = document.getElementById('mantorok');
        deselect(mantorok);
        mantorok.classList.add('unavailable');
        setAlignment();
    }
}

function select(entity) {
    entity.classList.add('selected');
}

function deselect(entity) {
    entity.classList.remove('selected');
}

function deselectAll(type, except) {
    Array.from(entities).forEach(entity => {
        if (entity.dataset.type === type && !entity.isSameNode(except)) deselect(entity);
    });
}

function changeActive(type, except) {
    Array.from(entities).forEach(entity => {
        if (entity.dataset.type === type) {
            entity.isSameNode(except) ? entity.classList.remove('inactive') : entity.classList.add('inactive');
        }
    });
}

function clearInactive(type) {
    Array.from(entities).forEach(entity => {
        if (entity.dataset.type === type) entity.classList.remove('inactive');
    });
}

function setAlignment() {
    let alignments = [];
    let summon = document.getElementById('summon');
    Array.from(document.querySelectorAll("[data-type='alignment'].selected")).forEach(alignment => {
        alignments.push(alignment.id);
    });
    if (alignments.includes('mantorok')) {
        document.body.className = 'mantorok';
        document.getElementById('mantorok').classList.remove('unavailable');
        summon.classList.add('unavailable');
    }
    else {
        switch (alignments.length) {
            case 1:
                document.body.className = alignments[0];
                break;
            case 2:
                if (['chatturgha', 'ulyaoth'].every(value => alignments.includes(value))) document.body.className = 'ulyaoth';
                if (['ulyaoth', 'xellotath'].every(value => alignments.includes(value))) document.body.className = 'xellotath';
                if (['xellotath', 'chatturgha'].every(value => alignments.includes(value))) document.body.className = 'chatturgha';
                break;
            default:
                document.body.className = 'unaligned';
        }
        summon.classList.remove('unavailable');
    }
}

function resetTable(resetAlignment = true) {
    Array.from(entities).forEach(entity => {
        if (!(entity.dataset.type === 'alignment' && !resetAlignment)) {
            entity.classList.remove('inactive', 'unavailable', 'selected', 'blind');
        }
    });
    if (resetAlignment) document.body.className = 'unaligned';
}

function toggleDisplay(e) {
    e.target.classList.toggle('active');
    let targetElements = document.getElementsByClassName(e.target.dataset.target);
    Array.from(targetElements).forEach(elem => {
        elem.classList.toggle('display-none');
    });
}
