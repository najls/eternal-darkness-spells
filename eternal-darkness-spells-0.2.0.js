const spells = [
    ['antorbok', 'magormor', 'enchant'],
    ['narokath', 'santak', 'recover'],
    ['narokath', 'redgormor', 'reveal'],
    ['bankorok', 'redgormor', 'field'],
    ['nethlek', 'redgormor', 'dispel'],
    ['tier', 'aretak', 'summon'],
    ['bankorok', 'santak', 'shield'],
    ['antorbok', 'redgormor', 'attack'],
    ['tier', 'redgormor', 'pool'],
    ['bankorok', 'aretak', 'bind']
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
                spells.forEach(spell => {
                    if (spell[spell.length - 1] === this.id) {
                        for (let i = 0; i < spell.length; i++) {
                            let entity = document.getElementById(spell[i]);
                            entity.classList.add('selected');
                            deselect(entity.dataset.type, entity);
                            changeActive(entity.dataset.type, entity);
                        }
                    }
                });
            }
            /* if any other entity was selected */
            else {
                if (this.dataset.type === 'alignment') setAlignment();
                let selected = document.getElementsByClassName('rune selected');
                spells.forEach(spell => {
                    /* if selected contains all required runes for the spell */
                    if (spell.slice(2).every(value => Array.from(selected).includes(document.getElementById(value)))) {
                        document.getElementById(spell[spell.length - 1]).classList.add('selected');
                    }
                });
            }
        }
        /* if a spell was deselected */
        else if (this.dataset.type === 'spell') { }
        /* if an alignment was deselected */
        else if (this.dataset.type === 'alignment') setAlignment();
        /* if any other entity was deselected */
        else { }
    });
});

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

function toggleDisplay(e) {
    e.target.classList.toggle('active');
    let targetElements = document.getElementsByClassName(e.target.dataset.target);
    Array.from(targetElements).forEach(elem => {
        elem.classList.toggle('display-none');
    });
}

function resetTable(resetAlignment = true) {
    Array.from(entities).forEach(entity => {
        if (!(entity.dataset.type === 'alignment' && !resetAlignment)) {
            entity.classList.remove('inactive', 'selected', 'blind');
        }
    });
    if (resetAlignment) document.body.className = 'unaligned';
}
