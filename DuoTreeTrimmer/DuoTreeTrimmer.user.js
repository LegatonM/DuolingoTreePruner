// ==UserScript==
// @name         Duolingo Trim tree
// @namespace    9a84a9d7b3fef7de9d2fd7155dcd794c
// @version      1.1
// @description  Tree trimmer to work with the new version of Duolingo's website
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @match        http://www.duolingo.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL  https://github.com/LegatonM/DuolingoUserscripts/raw/master/DuoTreeTrimmer/DuoTreeTrimmer.user.js
// ==/UserScript==

// This is an updated version of the tree trimmer by Arek Olek (https://www.duolingo.com/comment/12962386), intended to work with the current version of Duoling (2017-07-10). Credit for the original idea goes to Thomas de Roo

var maxHealth = 5;

var buttonStyle = `<style>
.trimmerButton {
display:block;
float: right;
margin-top: -4px;
}
@media (min-width: 700px) {
.trimmerButton {
float:none;
margin-left: auto;
margin-right: auto;
}
}
</style>`;
var buttonHtml = `<a id="trimmerButton" class="_3LN9C _3QG2_ _1vaUe _3IS_q _1XnsG _1vaUe _3IS_q " style="margin-left: 0.5em; padding-top: .75em; padding-buttom: .75em; " style="display: block">
</a>`;
//In the new version of the site, I could not find an "easy" way to find out what strength a lesson has. These classes are associated with strength in the current version.
var strengthClasses = ["_22Kj3", "_13qn4", "rgwrb", "_2SEng", "dYBTa"];

function UpdateButtonText()
{
    var trimValue = GM_getValue("trimValue",maxHealth);

    $('*[data-test="skill-tree"] .mAsUf #trimmerButton').html("<span>" + (trimValue < maxHealth ? trimValue + " bars or less" : "Everything") + "</span>");
}

function TrimTree()
{
    var trimValue = GM_getValue("trimValue", maxHealth);
    var trimmed = trimValue < maxHealth;

    $('*[data-test="skill-tree"] ._2GJb6 .W1dac').css("display", "");
    for(var i = 0; i <= maxHealth; ++i)
    {
        //Using css function to set style instead of toggle, as to not create overriding style information on the element
        $('*[data-test="skill-tree"] ._2GJb6 .W1dac .' + strengthClasses[i]).parent().parent().css("display", i < trimValue ? "" : "none");
    }
}

function EmtptyBelow(value)
{
    for(var i = 0; i < value; ++i)
    {
        if($('*[data-test="skill-tree"] .W1dac .' + strengthClasses[i]).size() > 0)
        {
            return false;
        }
    }
    return true;
}

$('body').on("click", "#trimmerButton", function(){
    var trimValue = (GM_getValue("trimValue", maxHealth) - 1);
    GM_setValue("trimValue",  trimValue < 1 || trimValue > maxHealth || trimValue != maxHealth - 1 && EmtptyBelow(trimValue) ? maxHealth: trimValue);
    UpdateButtonText();
    TrimTree();
});

function CreateButton()
{
    $('*[data-test="skill-tree"] .mAsUf').prepend(buttonHtml);
}

function Init()
{
    setTimeout(function(){
        if($('*[data-test="skill-tree"] .mAsUf #trimmerButton').size() === 0)
        {
            CreateButton();
        }
        UpdateButtonText();
        TrimTree();
    }, 100);
}

$(function(){
    Init();
});

// Look for changes to the page, since duolingo rarely reloads and you can lose the trimming & button
new MutationObserver(function(){
    Init();
}).observe(document.querySelector('body'),{childList: true, subtree: true});
