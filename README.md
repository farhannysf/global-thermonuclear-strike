# Global Thermonuclear Strike (Docs still WIP)
WIP 3D GIS simulation of UGM-133 Trident II D-5 ballistic missile MIRV payload detonation using Cesium in the very early state by Farhan Yusuf Nugroho

![main](https://raw.githubusercontent.com/farhannysf/global-thermonuclear-strike/main/assets/docs/main.png)

<p align="center">
  <a href="https://global-thermonuclear-strike.netlify.app/"><b>Shall we play a game? Try it live here!</b></a>
</p>

---

# Background

This is my debut JavaScript web app and I aim to educate the public with this web app about the magnitude of a nuclear weapon effect, specifically from UGM-133 Trident II D-5 ballistic missile. 

This is a Free and Open Source Software made in Indonesia as a gift to the Great Britain and the world in response to Great Britain's shift in its foreign policy and national security approach to increase cap on nuclear warheads from 180 to 260 for Global Britain in a Competitive Age. 

---

# Features
At the moment, this simulation only models:

* Static blast effect modelling of a single Mk-4 RV with 100 kT W76 mod 0 (W76-0) warhead detonation out of 8 possible RVs in MIRV payload of one UGM-133 Trident II D-5 ballistic missile and without multiple configuration possibilities of a warhead (variable yield)

* Fixed detonation altitude, airburst at 750m AGL

* Different overpressure levels to range of 5 overlapping radii with total fatal casualties estimation within the lethal range of nuclear explosion using Weighted Centroid geographic retrieval methodology from ArcGIS GeoEnrichment service to aggregate census data

* Mushroom cloud modelling

* No other effects, such as thermal damage or fallout levels are included yet

* From the current features listed above, it is obvious that there are so many features still WIP. This is a bare MVP that is very primitive and I am looking for open collaboration for much more accurate modelling, more dynamic modelling taking into account temporal changes in the states of the object, as well as improved frontend design and responsiveness

---

# How to Use
* Currently only optimized for Desktop use with 1920x1080 resolution
* Right click on map to detonate the warhead
* Left click on the resulting radii, mushroom cloud to inspect its properties

---

# References
* The Effects of Nuclear Weapons. (1977). United States: Department of Defense.
* [Blast Wave Effects Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT](https://nuclearweaponsedproj.mit.edu/Node/104)
* [Nuclear Fireball Calculator by Jean M. Bele, Physics Dept., Laboratory for Nuclear Science, MIT](https://nuclearweaponsedproj.mit.edu/Node/105)
* [Graphs of Nuclear Weapons Effects by Dr. Wm. Robert Johnston](http://www.johnstonsarchive.net/nuclear/nukgr3.pdf)
* [Nukemap by Alex Wellerstein](https://nuclearsecrecy.com/nukemap/)
