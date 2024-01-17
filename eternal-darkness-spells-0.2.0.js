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
const pargon = document.getElementById('pargon');

document.getElementById('name').addEventListener('click', toggleDisplay);
document.getElementById('translate').addEventListener('click', toggleDisplay);
document.getElementById('reset').addEventListener('click', resetTable);

var addMode = true;

Array.from(entities).forEach(entity => {
    entity.addEventListener('click', function() {
        /* if a spell has been clicked */
        if (this.dataset.type === 'spell') {
            /* if spell is being deselected */
            if (this.classList.contains('selected')) {
                // deselectSpell(this);
                // if (!addMode) resetTable(false);
            }
            selectRunes(this);
        }
        /* if a rune has been clicked */
        else {
            this.classList.toggle('selected');
            if (!addMode) {
                if (this.classList.contains('selected')) deselectAll(this.dataset.type, this);
                // else clearInactive(this.dataset.type);
            }
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
        let elem = document.getElementById(rune);
        entity.classList.contains('selected') ? elem.classList.remove('selected') : elem.classList.add('selected');
        if (!addMode) deselectAll(elem.dataset.type, elem);
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
    // if (!addMode) clearInactive('spell');
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
    /* if only pargon remains we deselect it as well */
    if (document.querySelectorAll("[data-type='verb'].selected, [data-type='noun'].selected").length === 0) deselect(pargon);

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
    let selectedRunes = document.querySelectorAll("[data-type='verb'].selected, [data-type='noun'].selected");
    deselectAll('spell');
    if (!addMode) {
        if (document.body.className === 'unaligned') setInactiveAll('alignment');
        if (!pargon.classList.contains('selected')) setInactive(pargon);
        else clearInactive('pargon');
        setInactiveAll('spell');
        Array.from(selectedRunes).forEach(rune => setInactiveAll(rune.dataset.type, rune));
        if (selectedRunes.length === 1) selectedRunes[0].dataset.type === 'verb' ? setInactiveAll('noun') : setInactiveAll('verb');
        for (const [spell, runes] of Object.entries(spells)) {
            /* The binding of Mantorok has weakened it, and it can no longer fuel incantations of this kind. */
            if (document.body.className === 'mantorok' && spell === 'summon') continue;
            /* if the spell includes all selected runes (one or two) */
            if (Array.from(selectedRunes).every(rune => runes.includes(rune.id))) {
                clearInactive('alignment');
                clearInactive('pargon');
                runes.forEach(rune => document.getElementById(rune).classList.remove('inactive'));
                document.getElementById(spell).classList.remove('inactive');
                if (selectedRunes.length === 2) select(document.getElementById(spell));
            }
        }

        // clearInactive('spell');
        // if (selectRunes.length === 1) {
        //     for (const [spell, runes] of Object.entries(spells)) {
        //         /* if selectedRunes contains all required runes for the spell */
        //         if (runes.every(rune => Array.from(selectedRunes).includes(document.getElementById(rune)))) {
        //             let elem = document.getElementById(spell)
        //             if (!elem.classList.contains('unavailable')) select(elem);
        //             if (!addMode) setInactiveAll('spell', elem);
        //         }
        //     }
        // }
    }
    else {
        for (const [spell, runes] of Object.entries(spells)) {
            /* if selected include all required runes for the spell */
            if (runes.every(rune => Array.from(selectedRunes).includes(document.getElementById(rune)))) {
                let elem = document.getElementById(spell);
                if (!elem.classList.contains('unavailable')) select(elem);
            }
        }
    }
    /* The Mantorok rune cannot be used in Summoning magicks. */
    if (document.getElementById('summon').classList.contains('selected')) {
        let mantorok = document.getElementById('mantorok');
        deselect(mantorok);
        mantorok.classList.add('unavailable');
        // if (!addMode) clearInactive('alignment');
        setAlignment();
    }
    else {
        mantorok.classList.remove('unavailable');
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

function setInactive(entity) {
    entity.classList.add('inactive');
}

function setInactiveAll(type, except) {
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
        if (!addMode) setInactiveAll('alignment', alignment);
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
                // if (!addMode) clearInactive('alignment');
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
