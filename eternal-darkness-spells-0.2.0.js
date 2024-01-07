const spells = [
    ['enchant', 'antorbok', 'magormor'],
    ['recover', 'narokath', 'santak'],
    ['reveal', 'narokath', 'redgormor'],
    ['field', 'bankorok', 'redgormor'],
    ['dispel', 'nethlek', 'redgormor'],
    ['summon', 'tier', 'aretak'],
    ['shield', 'bankorok', 'santak'],
    ['attack', 'antorbok', 'redgormor'],
    ['pool', 'tier', 'redgormor'],
    ['bind', 'bankorok', 'aretak']
];
const entities = document.querySelectorAll('.rune, .spell');

document.getElementById('name').addEventListener('click', toggleDisplay);
document.getElementById('translate').addEventListener('click', toggleDisplay);
document.getElementById('reset').addEventListener('click', resetTable);

Array.from(entities).forEach(entity => {
    entity.addEventListener('click', function() {
        if (this.classList.toggle('selected')) {
            /* if a spell was selected */
            if (this.dataset.type === 'spell') {
                showSpell(this);
                changeActive('spell', this);
                deselect('spell', this);
            }
            /* if any other entity except for pargon was selected */
            else if (this.id !== 'pargon') {
                if (this.dataset.type === 'alignment') setAlignment();
                else updateSelected();
            }
        }
        /* if a spell was deselected */
        else if (this.dataset.type === 'spell') {
            if (document.getElementsByClassName('spell selected').length > 0) {
                showSpell(this);
                changeActive('spell', this);
                deselect('spell');
                select(this);
            }
            else resetTable(false);
        }
        /* if an alignment was deselected */
        else if (this.dataset.type === 'alignment') setAlignment();
        /* if any other entity except for pargon was deselected */
        else if (this.id !== 'pargon') updateSelected();
        // mantorokSpecial();
    });
});

function updateSelected() {
    let selected = document.getElementsByClassName('rune selected');
    clearInactive('verb');
    clearInactive('noun');
    clearInactive('spell');
    deselect('spell');
    spells.forEach(spell => {
        /* if selected contains all required runes for the spell */
        if (spell.slice(1).every(value => Array.from(selected).includes(document.getElementById(value)))) {
            document.getElementById(spell[0]).classList.add('selected');
        }
    });
}

function showSpell(entity) {
    spells.forEach(spell => {
        if (spell[0] === entity.id) {
            for (let i = 1; i < spell.length; i++) {
                let rune = document.getElementById(spell[i]);
                rune.classList.add('selected');
                changeActive(rune.dataset.type, rune);
                deselect(rune.dataset.type, rune);
            }
        }
    });
}

function select(entity) {
    entity.classList.add('selected');
}

function deselect(type, except) {
    Array.from(entities).forEach(entity => {
        if (entity.dataset.type === type && !entity.isSameNode(except)) {
            entity.classList.remove('selected');
        }
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
    Array.from(document.querySelectorAll("[data-type='alignment'].selected")).forEach(alignment => {
        alignments.push(alignment.id);
    });
    if (alignments.includes('mantorok')) document.body.className = 'mantorok';
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
    }
}

function resetTable(resetAlignment = true) {
    Array.from(entities).forEach(entity => {
        if (!(entity.dataset.type === 'alignment' && !resetAlignment)) {
            entity.classList.remove('inactive', 'selected', 'blind');
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
