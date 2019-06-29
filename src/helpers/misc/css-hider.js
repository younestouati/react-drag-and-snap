/*
* When hiding the draggable (original or clone) we  are not using visibility: hidden to hide the 
* element for two reasons:
* 1. It can be overriden by the children
* 2. If any child has a CSS rule like 'transition: 3s', the fact that visibility is inherited,
* and that transitions apply to it, means that the child's hiding will be delayed, due to
* the way CSS transitions between non-numeric values: https://stackoverflow.com/a/37905071.
* Instead the element is hidden with clip-path (which can't be overriden by children and ensures
* that events won't be responded to). However, since it isn't supported in Edge, opacity: 0 and
* pointer-event: none is used as a fallback as well:
*/

export default function getCSSHidingRules() {
    return `
        clip-path: polygon(0px 0px,0px 0px,0px 0px,0px 0px)!important;
        -webkit-clip-path: polygon(0px 0px,0px 0px,0px 0px,0px 0px)!important;
        opacity: 0!important;
        pointer-events: none!important;
    `;
}
