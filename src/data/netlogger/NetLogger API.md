# NetLogger API notes

Public API

http://www.netlogger.org/api/The%20NetLogger%20XML%20Data%20Service%20Interface%20Specification.pdf

http://www.netlogger.org/api/

- GetActiveNets.php
- GetCheckins.php
- GetPastNets.php
- GetPastNetCheckins.php

# NetLogger Status

- (c/o) - Checked out - gray
- (n/h) - Not heard - yellow
- (n) - Needed - bright green
- (nxt) - Needed next - green
- (w) - Worked - red
- (u) - Unavailable - light blue
- (n/r) - Not Responding - dark green
- (nc) - Net Control - Dark purple
- (log) - Logger station - Purple
- (rel) - Relay - orange
- (vip) - VIP - dark red
- (op) - Operator - aqua

- Currently Operating - pink

# NetLogger app API

`GET http://www.netlogger.org/downloads/ServerList.txt`

`GET http://{server}//cgi-bin/NetLogger/GetServerInfo.pl`

ServerInfo includes pointer to

http://www.netlogger.org/downloads/ServerList.txt

and

http://www.netlogger.org/downloads/ClubInfoList.txt

which points at files like

http://www.omiss.net/downloads/OMISS.cli

`GET http://www.netlogger1.org/cgi-bin/NetLogger/GetNetsInProgress20.php?ProtocolVersion=2.3`

`GET http://www.netlogger1.org/cgi-bin/NetLogger/GetSystemMessages.php`

`GET http://www.netlogger1.org/cgi-bin/NetLogger/SubscribeToNet.php?ProtocolVersion=2.3&NetName=NATA%2040m%20Net&Callsign=W2ASD-SEBAS%20-%20v3.1.7M&IMSerial=0&LastExtDataSerial=0`

`POST http://www.netlogger1.org/cgi-bin/NetLogger/SendExtData.php`

HTML Form URL Encoded: application/x-www-form-urlencoded

- Form item: "NetName" = "NATA 40m Net"
- Form item: "ExtNumber" = "1"
- Form item: "ExtData" = "W2ASD-SEBAS|1029668135|11"

`POST http://www.netlogger1.org/cgi-bin/NetLogger/SendInstantMessage.php`

HTML Form URL Encoded: application/x-www-form-urlencoded

- Form item: "NetName" = "NATA 40m Net"
- Form item: "Callsign" = "W2ASD-SEBAS"
- Form item: "IsNetControl" = "x"
- Form item: "Message" = "Checkin?"

`GET http://www.netlogger1.org/cgi-bin/NetLogger/UnsubscribeFromNet.php?&Callsign=W2ASD-SEBAS%20-%20v3.1.7M&NetName=OMISS%2040m%20SSB%20Net`

`GET http://www.netlogger1.org//cgi-bin/NetLogger/GetUpdates3.php?ProtocolVersion=2.3&NetName=NATA%2040m%20Net&DeltaUpdateTime=2021-02-25%2023:26:34&IMSerial=4147426&LastExtDataSerial=14571710`

## NETS

`GET http://netlogger.org/cgi-bin/NetLogger/GetNetsInProgress20.php?ProtocolVersion=2.3`

```
_success_ <!--NetLogger Start Data-->EPA DIGITAL|PA Crossmode|W3GWM-GEORGE - v3.1.5W|W3GWM|20210225234510|FM|70cm|Y|20000|EPA DIGITAL||1|~Kentucky D-Star Net|REF056B|NN4H-LARRY - v3.1.5W|NN4H-LARRY|20210225232937|DSTAR|70cm|Y|20000|Kentucky D-Star Net||10|~Missouri Traffic Net|3.963|N0XWR-JERRY - v3.1.5W|N0XWR|20210225224728|SSB|80m|Y|20000|Missouri Traffic Net||15|~MOONLIGHTERS|7.279|KB3PET-SWANBOB - v3.1.5W|KB3PET|20210225225617|SSB|40m|Y|20000|MOONLIGHTERS||14|~NATA 40m Net|7.185|KI4YTV-SPECIAL ED - v3.1.7W|KI4YTV|20210225223206|SSB|40m|Y|20000|NATA 40m Net||38|~ON Dig JS8 and OL|7071.50|VE3YX-BOB - v3.1.5W|VE3YX|20210225233740|OLIVIA|40m|Y|20000|ON Dig JS8 and OL||2|~SPARC 2m Nightly Net|147.060|W4WYR - v3.1.5W|W4WYR|20210225232228|FM|2m|Y|20000|SPARC 2m Nightly Net||5|~SRQARES net|442.400|W1IIG-DAVID M. - v3.1.5W|W1IIG-DAVID|20210225233401|SSB|40m|Y|20000|SRQARES net||2|~The Friendly Bunch|3919|KI4EOT-RAY - v3.1.5W|KI4EOT|20210225234406|SSB|80m|Y|20000|The Friendly Bunch||2|~W8IRA Michigan Noon Time Net|147.160|KE8GC-GREG - v3.1.7W|KE8GC|20210225225656|FM|2m|Y|20000|W8IRA After Work Net||4|~Wolverine Single Sideband Net|3.935|K8DXJ-DORIS - v3.1.5W|K8DXJ|20210225213955|SSB|80m|Y|20000|Wolverine Single Sideband Net||11|~<!--NetLogger End Data-->
```

`GET /cgi-bin/NetLogger/GetSystemMessages.php`

`GET /cgi-bin/NetLogger/SubscribeToNet.php?ProtocolVersion=2.3&NetName=NATA%2040m%20Net& Callsign=W2ASD-SEBAS%20-%20v3.1.7M&IMSerial=0&LastExtDataSerial=0`

`POST /cgi-bin/NetLogger/SendExtData.php``

HTML Form URL Encoded: application/x-www-form-urlencoded

- Form item: "NetName" = "NATA 40m Net"
- Form item: "ExtNumber" = "1"
- Form item: "ExtData" = "W2ASD-SEBAS|1029668135|11"

## CHAT

`GET /cgi-bin/NetLogger/GetUpdates3.php?ProtocolVersion=2.3&NetName=NATA%2040m%20Net&DeltaUpdateTime=2021-02-25%2023:26:34&IMSerial=4147426&LastExtDataSerial=14571710`

`GET /cgi-bin/NetLogger/GetUpdates3.php?ProtocolVersion=2.3&NetName=NATA%2040m%20Net&DeltaUpdateTime=2021-02-25%2023:35:57&IMSerial=4147458&LastExtDataSerial=1457206`

http://netlogger.org/cgi-bin/NetLogger/GetUpdates3.php?ProtocolVersion=2.3&NetName=NATA%2040m%20Net

`GET /cgi-bin/NetLogger/UnsubscribeFromNet.php?&Callsign=W2ASD-SEBAS%20-%20v3.1.7M&NetName=OMISS%2040m%20SSB%20Net`

`GET http://www.netlogger.org/cgi-bin/NetLogger/OpenNet20.php?NetName=ENY%20ARES%20RACES&Token=123&Frequency=3993&NetControl=KI2D&Logger=W2ASD-SEBAS%20-%20v3.1.7M&Mode=SSB&Band=80m&EnableMessaging=Y&UpdateInterval=20000&MiscNetParameters=`

```
_success_ <!--NetLogger NetControl Start-->KI2D<!--NetLogger NetControl End--><!--NetLogger LoggerName Start-->W2ASD-SEBAS - v3.1.7M<!--NetLogger LoggerName End-->\n
```

`POST /cgi-bin/NetLogger/SendUpdates3.php`

HTML Form URL Encoded: application/x-www-form-urlencoded

- Form item: "ProtocolVersion" = "2.3"
- Form item: "NetName" = "ENY ARES RACES"
- Form item: "Token" = "123"
- Form item: "UpdatesFromNetControl" = "`1|future use 2|future use 3|`^future use 4|future use 5^"

```
_success_ \n
```

`GET /cgi-bin/NetLogger/GetSystemMessages.php`

```
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"\n
    "http://www.w3.org/TR/html4/loose.dtd">\n
<html>\n
<head>\n
<title>\n
</title>\n
</head>\n
<body>\n
*success* <!--NetLogger SystemMessages Start-->16|Admin|2020-04-11 14:37:29|1|2034-12-31 00:00:00||Welcome to NetLogger!<br />\r\n
<br />\r\n
If you are running your first net on NetLogger please read the following operating tip:<br />\r\n
<br />\r\n
At the conclusion of your net please remember to click the <b>CLOSE NET</b> button to terminate your net in an orderly fashion. (Further details about running a net can be found in the in-program HELP menu.)<br />\r\n
<br />\r\n
--- NetLogger Development and Support Team ---<br />\r\n
<a href="http://www.netlogger.org">www.netlogger.org</a>\r\n
\r\n
|~<!--NetLogger SystemMessages End-->\n
</body>\n
</html>
```

`GET /cgi-bin/NetLogger/CloseNet.php?NetName=ENY%20ARES%20RACES&Token=123`

`POST /cgi-bin/NetLogger/SendUpdates3.php`

- Form item: "ProtocolVersion" = "2.3"
- Form item: "NetName" = "ENY ARES RACES"
- Form item: "Token" = "123"
- Form item: "UpdatesFromNetControl" = "A|1|KC2OWV|Waterford|NJ|Allan R Cassady Jr|(no club info)| |Camden|FM29oq|645 Autumn Crest Dr|08089| | |United States|291|Allan~`1|future use 2|future use 3|`^future use 4|future use 5^"

- Form item: "UpdatesFromNetControl" = "A|2|KN2X|Wurtsboro|NY|John J Lavelle Jr|(no club info)| |Sullivan|FN21so|376 Wilsey Valley Rd|12790| | |United States|291|John~`2|future use 2|future use 3|`^future use 4|future use 5^"

- Form item: "UpdatesFromNetControl" = "`3|future use 2|future use 3|`^future use 4|future use 5^"
- Form item: "UpdatesFromNetControl" = "`1|future use 2|future use 3|`^future use 4|future use 5^"

- Form item: "UpdatesFromNetControl" = "U|1|KC2OQV|Grahamsville|NY|William T Conjura|(no club info)| |Sullivan|FN21rt|25 Groo Rd|12740| | |United States|291|William~`1|future use 2|future use 3|`^future use 4|future use 5^"

- Form item: "UpdatesFromNetControl" = "`3|future use 2|future use 3|`^future use 4|future use 5^"

### Insert

- Form item: "UpdatesFromNetControl" = "U|2| | | | | | | | | | | | | | | ~U|3|W2COD|Pine Bush|NY|MARK| |F QRZ--LoTW-and-US-Mail-(Cards)|Sullivan|FN21|160 Frey Road|12566|(ff)|12977|United States|291|Mark~U|4|KN2X|Wurtsboro|NY|John J Lavelle

- Form item: "UpdatesFromNetControl" = "U|3|W2COD|Pine Bush|NY|MARK| |F QRZ--LoTW-and-US-Mail-(Cards)|Sullivan|FN21|160 Frey Road|12566|(ff),(rel)|12977|United States|291|Mark~`3|future use 2|future use 3|`^future use 4|future use 5^"

- Form item: "UpdatesFromNetControl" = "U|4|KN2X|Wurtsboro|NY|John J Lavelle Jr|(no club info)| |Sullivan|FN21so|376 Wilsey Valley Rd|12790|(vip)| |United States|291|John~`4|future use 2|future use 3|`^future use 4|future use 5^"

- Form item: "UpdatesFromNetControl" = "U|4|KN2X|Wurtsboro|NY|John J Lavelle Jr|(no club info)| |Sullivan|FN21so|376 Wilsey Valley Rd|12790|(clg),(log),(vip)| |United States|291|John~`4|future use 2|future use 3|`^future use 4|future use 5^"
