# KSA Operations Tracker
A means of dynamically displaying information online for vessels, bodies and crew in Kerbal Space Program

The following KSP mods/apps are used to provide the data the Operations Tracker requires:

* [KSPTOT](http://forum.kerbalspaceprogram.com/threads/36476-WIN-KSP-Trajectory-Optimization-Tool-v0-12-2-Mission-Architect-Update!)
* [Final Frontier](http://forum.kerbalspaceprogram.com/threads/67246)
* [VOID](http://forum.kerbalspaceprogram.com/threads/54533-0-23-VOID-Vessel-Orbital-Informational-Display)
* [FAR](http://forum.kerbalspaceprogram.com/threads/20451-0-23-Ferram-Aerospace-Research-v0-12-5-2-Aero-Fixes-For-Planes-Rockets-1-7-14)
* [kOS](https://github.com/KSP-KOS/KOS)

The following JavaScript libraries are used:

* [JQuery](https://jquery.com/)
* [Leaflet](http://leafletjs.com/)
* [Leaflet.Kerbal](https://gitlab.com/IvanSanchez/Leaflet.Kerbal)
* [Sylvester](http://sylvester.jcoglan.com/)
* [Numeral](http://numeraljs.com/)
* [Tipped](http://www.tippedjs.com/)
* [Codebird](https://github.com/jublonet/codebird-js)
* [Spin.js](http://fgnass.github.io/spin.js/)
* [Rrose](http://erictheise.github.io/rrose/)
* [Leaflet.Fullscreen](https://github.com/brunob/leaflet.fullscreen)
* [Leaflet.GroupedLayerControl](https://github.com/ismyrnow/Leaflet.groupedlayercontrol)
* [GeoGebra](https://wiki.geogebra.org/en/Reference:JavaScript)
* [JQuery UI](https://jqueryui.com/)
* [w2ui sidebar](http://w2ui.com/web/demo/sidebar)
* [Leaflet.EasyButton](https://github.com/CliffCloud/Leaflet.EasyButton)
* [Font Awesome](http://fontawesome.io/icons/)
* [Leaflet.LinearMeasurement](https://github.com/NLTGit/Leaflet.LinearMeasurement)
* [Leaflet.MousePosition](https://github.com/ardhi/Leaflet.MousePosition)
* [Leaflet.hotline](https://github.com/iosphere/Leaflet.hotline)
* [Leaflet.contextmenu](https://github.com/aratcliffe/Leaflet.contextmenu)

### Important Known Issues

- **Operations Tracker is currently in active development with work being done on the live page, so visiting at times may cause browser errors, failures to load, etc. However after it has been worked on it is left in a usable state**
- Leaflet map can be finicky in a number of ways - most notably it doesn't mousewheel zoom centered on the cursor and can sometimes load showing off the edge of the map or refuse to load tiles. It can also fail to render paths and markers or not allow you to properly hover for information over paths. Generally these issues can all be fixed by upsizing/downsizing or going fullscreen
- The downsized default map view for vessel pages is not able to show position info for orbital plots when hovering over the lines. Sizing up the map or going fullscreen will enable this feature
- Collapsing/Expanding the [Operations Menu](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Navigation) can sometimes cause the entire area to go blank the next time something in it is clicked on
- Ground tracks for aircraft can sometimes not be hovered over to display additional information for that point in the flight. Try zooming in closer or panning the map view around a bit

### Future Fixes/Changes/Additions

See all current bugs and future enhancements over in our [Issues Tracker](https://github.com/KSAMissionCtrl/OpsTracker/issues).

### Change Log

Versioning Key (v#1.#2.#3): #1=New features #2=Changes to existing features #3=Fixes to existing features

**v8.0.2** (5/8/18)

Fixes:
  - When watching a launch countdown that goes into a HOLD state, the countdown timer in the [Event Calendar](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Clock-&-Event-Calendar) now no longers comes back up after a second
  - No longer storing a number as a string - could have potentially caused issues at some point
  - If multiple launche times are scheduled to be publicly visible at the same time the Ops Tracker now properly chooses the closest one to display in the Event Calendar rather than the last one

**v8.0.1** (4/18/18)

Fixes:
  - When more than one future launch or maneuver is scheduled the [Event Calendar](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Clock-&-Event-Calendar) now shows the first scheduled event rather than the last

**v8.0.0** (4/15/18)

Fixes:
  - When adding a new [Flight Plot](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map#flight-plotting) from the [Operations Menu](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Navigation) any previously-removed flights plots are no longer redrawn
  - If the GeoGebra figure loads before the menu data it will now wait for the AJAX call return rather than get hung up in a recursive function that prevents the site from operating normally
  - Moving quickly back/forward through the browser history no longer causes a dialog to appear asking to render orbital data when you are no longer even looking at a [Vessel Details](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Vessel-Details) page
  - When data for the sun is loaded (looking at the Kerbol System figure) the sun marker no longer tries to update its position on the [Surface Map](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map)
  - Flight plots that have already been loaded can now be switched to and viewed via the operations menu when looking at other vessels/bodies/crew
  - Map interface no longer automatically hides 3 seconds after loading if the device uses a touchscreen
  - When viewing a flight plot with the additional details popup open and the plot is hidden via the [Layers Control](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map#layers-control) the popup is closed
  - If a flight plot additional details popup is open when switching to a vessel or another body the popup is closed
  
Changes:
  - When viewing a [Surface Map](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map), clicking on the same planet as the map is now another way to hide the map (as opposed to using the close map button on the map itself)
  - Sun icon in the layers control is now a Font Awesome symbol rather than an image
  - Selecting (left-click) a flight plot on the surface map now also selects it in the operations menu

Additions:
  - A context menu has been added as a new [Map Interaction](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map#map-interaction) - more will be done with this in later versions but for now adds a simple way to copy the current mouse position coordinates straight to the clipboard
  - You can now select a new option in the flight plot additional details popup that shows a color gradient signifying the altitude of the aircraft over the course of its flight. Only one path at a time can show this data so they remain diferrentiated by their colors. If a path is already showing this data when another is selected, that path will automatically revert to normal. Future plans for this feature, currently only a proof of concept, can be found in [this issue](https://github.com/KSAMissionCtrl/OpsTracker/issues/51).
  
**v7.0.0** (4/14/18)

Additions:
  - The surface map [Layers Control](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map#layers-control) now has a new default layer that allows you to display the sun's current position along with the terminator line that separates night and day, showing which areas of the body are in darkness. This layer is updated every second.

**v6.2.1** (4/12/18)

Fixes:
  - Removing pins from [Flight Plots](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map#flight-plotting) removes them from the layer also now not just the map, so they do not reappear if you show and hide the path
  - Viewing [Vessel Details](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Vessel-Details) for an active vessel after the page was initially loaded for an inactive vessel now properly prompts for any orbital calculations that are needed
  - When a vessel is updated with new data as the page is being viewed, if new orbital data is included the current plot is now removed and the new plot drawn

**v6.2.0** (4/8/18)

Fixes:
  - Dialog for map now removes the map resize button everytime it pops up, not just the first time
  - Map no longer errors out due to an uninitialized control if the user mouses over it immediately upon page load
  - Map dialog asking for how to render orbits that are too long no longer assumes it will pop up all the time and closes when switching to another vessel. Re-opens if needed
  - Vessel marker popup no longer shows 00000 values for the vessel data when it is first opened after returning to an already-drawn plot
  - Twitter feed now shows for timelines that don't have a UT defining when they can be shown
  - Previously-rendered plots are now properly redrawn when the craft is visited again ([see wiki](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Vessel-Details#orbital-tracking) for details)
  - Left-side buttons to control various map functions now properly show up when they are loaded
  
Changes:
  - [Twitter Feed](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Twitter-Feed) now shows full dates dates with times for each tweet, including new tweets loaded when more are requested
  - When a map dialog is open, the fullscreen control is now hidden along with the map resize button

**v6.1.0** (3/21/18)

Fixes:
  - Surface map loader is now more ready to handle loading between different bodies
  - Map controls hide completely when mouse if off the map - before there was a tiny container box visible in the upper-left
  - [Surface Map](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map) now transitions better between full surface view and vessel view without having to make the map fullscreen to allow it to pan properly
  
Changes:
  - Updated Leaflet.Fullscreen plugin
  - Removed Leaflet.KSP from list of dependencies, added Leaflet.Kerbal
  - New known issue added: Starting from the default Kerbol System overview it has been sometimes impossible to select another body from the [Operations Menu](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Navigation). Selecting a vessel will fail to load the surface map when needed. No apparent errors are logged on page load or when attempting to select another body. Reloading the website should clear this up for now
  

**v6.0.0** (3/20/18)

Fixes:
  - Multiple popups can be displayed on the map again
  
Changes:
  - Clicking on the map no longer closes a popup. You must click on the X or again on the object that opened the popup
  - You can no longer pan off the edge of the map, the view will bounce back
  - Leaflet.Label has been replaced with the native tooltip ability for popping up text when hovering over [Labels](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map#layers-control)
  
Additions:
  - [Measurement Control](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map#measurement-control) allows for plotting surface lines on the map to get distances and bearings
  - A scale and mouse coordinate control have been placed in the bottom-left corner of the [Surface Map](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map) 

**v5.0.0** (3/19/18)

Fixes:
  - Birthdays in [Crew Details](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Crew-Roster#crew-details) are no longer displayed 1 day early in the Additional Information window
  - [Clock](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Clock-&-Event-Calendar) now displays the proper UT offset
  - [Twitter Feed](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Twitter-Feed) no longers reloads when paging through the history of a vessel
  - [Parts Display](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Vessel-Details#parts-display) has been re-implemented to support all browsers
  - Launch time information in the [Vessel Details](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Vessel-Details) now properly displays relevant info in the tooltip during scrub/hold situations
  - Vessels that have future events now display properly
  
Changes:
  - The [Cursor Information Control](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map#map-controls) has been removed as it was dependent on the Leaflet.KSP plugin used with the older map version. It will be back

Additions:
  - Leaflet has been upgraded to the latest version! This was largely dependent upon the work done by Ivan Sanchez and his [new maps library](https://gitlab.com/IvanSanchez/Leaflet.Kerbal). Map issues remain and will be addressed in future updates.

**v4.0.0** (2/15/18)

Fixes:
  - The tooltip for the mission launch time now changes from a countdown to launch to a count up in mission elapsed time when the countdown reaches 0 during a launch viewing
  - The twitter source no longer resets to the main feed only when a page is updated or swapped unless a crew or mission feed is loaded
  - After selecting a "Scheduled Event" from the Next Events dropdown box it is reset to allow the user to select it again
  
Additions:
  - None, this was an erroneous change to the major revision number thanks to failing to review the changes before submission and thinking a new addition was included. Can't edit the commit name to v3.1.1 so looks like we're now on v4

**v3.1.0** (2/1/18)

Fixes:
  - The local time shown in the tooltip for the Last Update field in [Vessel Details](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Vessel-Details) now properly accounts for DST
  - [Vessel Filters](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Orbital-View#vesselasteroid-filters) behavior has been tweaked again to prevent it from displaying atop the dynamic map after page load
  - Countdowns for the time to launch tooltips as well as Ap/Pe markers now also make proper use of the fix in v3.0.0 that kept the main clock in sync by no longer comparing a whole number to a decimal
  - Launchsite marker now removes itself from the [Surface Map](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map) when it is viewed from a pre-launch vessel
  - When switching from a vessel that does have a mission [Twitter Feed](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Twitter-Feed) to one that does not, the default main feed is now loaded
  - Vessel Details page no longer schedules an update for an upcoming twitter mission timeline posting if the mission has ended
  - Additional Resources field on the Vessel Details page no longer prepends "undefined" to the list of resources
  - Planets other than Kerbin, Mun or Minmus with spacecraft in orbit will not attempt to load the dynamic map
  
Changes:
  - The [Orbital View](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Orbital-View) now automatically hides sphere of influence bubbles when decluttering the view after initial load and the option to show/hide them has been added to the view options at the bottom
  - Last Update field in the Vessel Details view now specifies the time as UTC

**v3.0.0** (1/25/18)

Fixes:
  - The clock and any countdown timers are no longer sometimes 1s off each other because of a decimal to whole number comparison being done that would round the decimal up or down depending on when the page was loaded
  - Distance Traveled in the [Crew Details](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Crew-Roster#crew-details) is now formatted and labeled as kilometers
  - Option to show all ribbons for Crew Details no longer fades in/out with every change from one crew data to the next
  - The [Event Calendar](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Clock-&-Event-Calendar) now properly resizes itself if needed when new data is fetched for it after the page has finished its initial load
  - You can now select a flight track from a vessel or crew details page and the surface map will show properly
  - No longer comparing a string to an integer in several places, one of which was causing intermittent page load failures (removed Known Issue)
  - Vessels withe multiple names over a period of time will now have the proper name displayed in the menu
  - Active Vessels are once again properly sorted in alphabetical order
  - The currently-selected menu item is scrolled back into view when the [Menu Filters](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Navigation#filters) are hidden
  - [Vessel Filters](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Orbital-View#vesselasteroid-filters) no longer stay visible atop the [Surface Map](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map) in instances where the data finished loading after the map was displayed
  - Various code optimizations

Changes:
  - Once an event is reached, the Event Calendar will fetch new event information after 5 seconds
  - During an ascent when viewing the dynamic map the info popup for the craft location no longer auto-hides after 5 seconds

Additions:
  - Now that all the data can be loaded intially, the update system has been overhauled so data can be loaded initially and cached for the next update so changes are instant, with the following update data loaded in the background. This also means active crew and vessels are displayed much faster when they are viewed. Deceased crew and inactive vessels still have their data fetched when viewed, and viewing past events requires a data fetch although the data for the next update of any active vessel remains cached regardless of whether a past event is being viewed or not. If you are looking at the vessel being updated there will be a visual indication of new data being displayed. Currently this does not happen for crew pages. This system is the groundwork for browser notifications

**v2.0.0** (1/14/18)

Fixes:
  - Browser history now only preserves URL parameters if it is the first time the page is loaded so what is shown in the URL bar remains consistent with past activity
  - Vessel names in the [Orbital View](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Orbital-View) are no longer displaying HTML tags 
  - The content no longer reloads itself if you click on the menu item for a body that is already loaded
  - Surface tracks are no longer missing a plot point everytime the path wrapped around to the other side of the map
  
Changes:
  - Crew ribbons have a new back-end DB format for easier maintenence. Display is the same
  
Additions:
  - [Flight plotting](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map#flight-plotting) is now supported when you select an aircraft from the Inactive Vessels list, allowing also for plots to be loaded with page load using the `&flt` command
  - Added and updated some Known Issues

**v1.1.1** (1/9/18)

Fixes:
  - When collapsing the menu the current selection is scrolled back into view
  - [Vessel Details](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Vessel-Details) now give the option to see more information about a future upcoming event in the Mission History navigation dropdown
  - [Events Calendar](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Clock-&-Event-Calendar) now properly swaps the page content without reloading instead of linking to an entirely new page when selecting the vessel displayed
  - The [Twitter Feed](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Twitter-Feed) could be hidden in some instances and not re-shown on page load
  - Additional Resources in the Vessel Details now properly links to each resource and loads it in a new tab

**v1.1.0** (1/9/18)

Fixes:
  - found some more strings that were being compared to numbers without first being converted into numbers themselves
  - `loadVessel()` was using a local variable named the same as a global and changed the name to avoid confusino

Changes:
  - [Events Calendar](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Clock-&-Event-Calendar) and [Operations Menu](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Navigation) have been linked to update events so they provide new data when it is available for vessels. The Events Calendar updating is pretty obvious, but for items in the Operations Menu that could be hidden from view, the top-level will expand if it isn't already and badges will appear next to folders/bodies that contain updated vessels with a count of how many. The updated vessels themselves will have their names bolded
  - The events calendar can now show vessel names that take up more than one line

**v1.0.0** (1/4/18)   
(all fixes/changes/additions listed are based on v4.12 of the [Flight Tracker](https://github.com/KSAMissionCtrl/FlightTracker#change-log))

Fixes:
  - [Body Information Dialog](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Orbital-View#body-information-dialog) now displays body mass properly
  - [Clock](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Clock-&-Event-Calendar) is now always accurate to within 1-2 seconds rather than being anywhere from 40-90s slow
  - The shift to/from DST is now handled properly so times for events are all shown at the proper local and UTC values
  - Clock adjusts to no longer be one second off after page load is complete
  - [Surface tracks](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Vessel-Details#orbital-tracking) of orbital vessels no longer have a small gap between where one orbit ends and the next begins

Changes:
  - All pages unified into a single page that can dynamically adjust its content to display information on crew, vessels or bodies. This means the page can reload parts of itself independently rather than needing to reload the entire page when a small amount of information needs to be updated
  - Clicking on spacecraft no longer brings up an information window, but instead shows its orbital nodes and name. Clicking on its position again will load up its [Vessel Details](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Vessel-Details)
  - [Operations Menu](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Navigation#the-operations-menu) items no longer show tooltip discriptions of the vessels/crew (but looking to bring this back at some point)
  - Operations Menu now shows crew and vessels at the same time
  - Body information Dialog can be repositioned and updates if a new planet is selected, but if it is closed it opens up again in the default position
  - Clicking on a moon in the menu will load the figure of the planetary system in which it resides
  - Inactive Vessels are organized into folders sorted by year descending and then month ascending
  - Active Vessels are listed in alphabetical order
  - The [Twitter Feed](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Twitter-Feed) shown can be changed in some instances to view only tweets relevant to the vessel/crew member
  - Clicking for additional vessel/crew information no longer pulls up text but instead opens a dialog box containing the text, which can be moved and resized. When closed, it will re-open over top the vessel/crew image again next time
  - The [Surface Map](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map) when viewed in the vessel page can now be expanded to fill the entire content area in addition to going fullscreen
  - Full Roster view tooltips now show additional data for # of missions completed and ribbons earned
  - After all custom pins are loaded the map veiw will size to encompass them all at the smallest zoom level possible
  - [Layers control](https://github.com/KSAMissionCtrl/OpsTracker/wiki/Surface-Map#layers-control) stays open and does not collapse until all map layers are loaded, but still hides with the rest of map controls when the cursor is off the map
  - Detecting what to show using the `&layers` command is much more lenient. For example you can say `anomalies` or `anomaly`
  - The `&map` command to show the surface map of a body on page load no longer needs a value, is no longer required in conjunction with other commands and should always be placed at the end of the URL
  - Vessel orbits are always rendered in full by default, from 1 up to a max of 3. However you can cancel the calculations at anytime and what has been calculated will be rendered
  - After each full orbit is rendered it is immediately added to the map
  - If the view is changed to a body or crew while a vessel orbit is calculating, it will be paused. If you return to that vessel before any other, the calculation will pickup where it left off. Otherwise it will be tossed out and new calculations begun for a new vessel
  - Orbital calculation batch size has been reduced from 1500 to 1000 calculations to allow for smoother browser performance due to the slightly increased browser load brought on with the Geogebra figure

Additions:
  - When viewing a system that has vessels in orbit, they are dynamically loaded and added to the GeoGebra figure
  - Can show/hide the orbits of various types of vessels
  - Re-sorting the crew menu will also re-sort the Full Roster display if it is visible. If not then when loaded it will always sort crew in the same order as the current menu sort selection
  - Custom pins placed on the map through the `&loc` option will show up in their own map layer so they can be shown/hidden as a group
  - Map button when viewing a vessel that lets you jump to the planet/system overview and see all the orbit tracks
  - If a crew member has ribbons that have been superseded by higher achievements, the option is given to show all the ribbons earned, then also hide them again if wanted
  - Vessels can have additional sources of material listed that links to things like various reports on the mission, launch telemetry data, etc. These appear as file icons in the Data Box that can be clicked, with tooltips describing the nature of each
  - The Layers control in the upper-right of the map now contains a layer for each vessel orbit that is plotted, which allows the user to show/hide any orbits and their accompanying markers
  - After surface tracks are complete a button on the map will allow you to refresh them at any time (currently they will not refresh themselves at the end of a plot but eventually they will do so and this button will remain)
