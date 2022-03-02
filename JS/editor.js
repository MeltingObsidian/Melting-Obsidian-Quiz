function load(){
    const url = new URLSearchParams(window.location.search)
    var client = gapi.auth2.init({client_id: "416030417638-urh4nlr608etmssd75f9qterub8d7apg.apps.googleusercontent.com", scope: "profile https://www.googleapis.com/auth/drive.file"})
    var profile = gapi.auth2.getAuthInstance()
    profile.then(() =>{
        //alert(profile.currentUser.get().getBasicProfile().getName())
    })
    var signOutButton = $("<button id='signout-btn' class='moquiz-button'>SignOut</button>")
    signOutButton.click(() =>{
        client.signOut()
        window.location = './'
    })
    const cancelElements = 'moquiz-section-title, .moquiz-question, .moquiz-dropdown, .moquiz-paragraph, .moquiz-regex-input, .moquiz-math-input, .moquiz-code-editor, .moquiz-text-field, .moquiz-text-input, .moquiz-editor, .moquiz-slider, .moquiz-button';
    function assign(obj, keyPath, value) {
        lastKeyIndex = keyPath.length-1
        for (var i = 0; i < lastKeyIndex; ++ i) {
            key = keyPath[i];
            if (!(key in obj)){
                obj[key] = {}
            }
            obj = obj[key]
        }
        obj[keyPath[lastKeyIndex]] = value
    }
    createSlider = (text, min = 0, max = 100, step = 1) =>{
        var container = $("<div class='moquiz-slider-container'></div>")
        var range = $("<div class='moquiz-slider-range'></div>")
        var slider = $("<div class='moquiz-slider'></div>")
        var valStart = $("<div class='moquiz-slider-min-value'>"+min+"</div>")
        var valEnd = $("<div class='moquiz-slider-max-value'>"+max+"</div>")
        var label = $("<div class='moquiz-slider-label'>"+text+": 0"+"</div>")
        var valCurrent = 0
        slider.draggable({
            axis: 'x', 
            cursor: 'pointer', 
            containment: 'parent', 
            distance: (range.innerWidth()/((max-min)+1))*step, 
            drag: (event, ui) =>{
                valCurrent = (((ui.position.left/range.innerWidth())*100)/100)*((max-min)+1)
                label.text(text+": "+valCurrent)
            }
        })
        range.append(slider)
        container.append(range, valStart, valEnd, label)
        return container
    }
    
    var quiz = {"name":"New Quiz", "title":"Quiz Title", "description":"Description"}
    var body = $("body")
    var title = $("<h1>Quiz Title</h1>").attr("contenteditable", true).addClass("moquiz-title")
    title.click(() =>{
        if(title.text() == "Quiz Title")
            title.text("")
    })
    title.blur(() =>{
        if(title.text() == "")
            title.text("Quiz Title")
        quiz['title'] = title.text()
    })
    var saveButton = $("<button id='save-btn'>Save</button>").addClass("moquiz-button")
    var description = $("<p>Description</p>").attr("contenteditable", true).addClass("moquiz-description")
    description.click(() =>{
        if(description.text() == "Description")
            description.text("")
    })
    description.blur(() =>{
        if(description.text() == "")
            description.text("Description")
        quiz['description'] = description.text()
    })
    var addSectionButton = $("<button>Add Section</button>").attr("id", "add-section").addClass("moquiz-button")
    var topSection = $("<section></section>").attr("id", "main-section").addClass("moquiz-section-main")
    var sectionDragArea = $("<div></div>").addClass("moquiz-section-drag-area")
    var sectionIt = 0
    addSectionButton.click(() =>{
        var sectionTitle = $("<h2>Section Title</h2>").attr("contenteditable", true).addClass("moquiz-section-title")
        sectionTitle.click(() =>{
            if(sectionTitle.text() == "Section Title")
                sectionTitle.text("")
                sectionTitle.focus()
        })
        sectionTitle.blur(() =>{
            if(sectionTitle.text() == "")
                sectionTitle.text("Section Title")
            assign(quiz, ["sections", section.attr("id"), "title"], sectionTitle.text())
        })
        var addQuestionButton = $("<button>Add Question</button>").addClass("moquiz-button")
        var section = $("<section id='section"+sectionIt+"'></section>").addClass("moquiz-section")
        var questionDragArea = $("<div></div>").addClass("moquiz-question-drag-area")
        assign(quiz, ["sections", section.attr("id"), "title"], "Section Title")
        section.append(sectionTitle)
        section.append(addQuestionButton)
        var questionIt = 0
        addQuestionButton.click(() =>{
            var addQuestionElement = $("<button>Add Element</button>").addClass("moquiz-button")
            var mainQuestion = $("<h3>Question</h3>").attr("contenteditable", true).addClass("moquiz-question")
            mainQuestion.click(() =>{
                if(mainQuestion.text() == "Question")
                    mainQuestion.text("")
            })
            mainQuestion.blur(() =>{
                if(mainQuestion.text() == "")
                    mainQuestion.text("Question")
                    assign(quiz, ["sections", section.attr("id"), "questions", container.attr("id"), "title"], mainQuestion.text())
            })
            var container = $("<article id='question"+questionIt+"'></article>").addClass("moquiz-container")
            var questionElementDragArea = $("<div></div>").addClass("moquiz-quesion-element-drag-area")
            var questionContainer = $("<header></header>").addClass("moquiz-question-container")
            assign(quiz, ["sections", section.attr("id"), "questions", container.attr("id"), "title"], "Question")
            questionContainer.append(mainQuestion, addQuestionElement)
            var it = 0
            var elementIt = 0
            addQuestionElement.click(() =>{
                var questionPartContainer = $("<div id='question-element"+elementIt+"'></div>").addClass("moquiz-question-part-container")
                var questionType = $("<select>"+"<option value='0' disabled='disabled' selected='selected'>Select</option>"+"<option value='1'>Paragraph</option>"+"<option value='2'>FillUps</option>"+"<option value='3'>Image</option>"+"<option value='4'>Math</option>"+"<option value='5'>Sortable</option>"+"<option value='6'>List</option>"+"<option value='7'>Code</option>"+"</select>").addClass("moquiz-dropdown")
                questionType.on("change", () =>{
                    var id = 0
                    questionType.slideUp()
                    switch (questionType.find(":selected").val()) {
                        case "1":
                            questionPartContainer.empty()
                            var input = $("<span>Paragraph</span>").attr("contenteditable", true).addClass("moquiz-paragraph-input")
                            var paragraph = $("<div class='moquiz-paragraph'></div>")
                            var completion = $("<span contentedeitable='true' class='moquiz-ai-text-completion'></span>")
                            var removeButton = $("<button>Remove</button>").addClass("moquiz-button")
                            assign(quiz, ["sections", section.attr("id"), "questions", container.attr("id"), "elements", questionPartContainer.attr("id"), "type"], "paragraph")
                            assign(quiz, ["sections", section.attr("id"), "questions", container.attr("id"), "elements", questionPartContainer.attr("id"), "content"], "Paragraph")
                            input.click(() =>{
                                if (input.text() == "Paragraph")
                                    input.text("")
                            })
                            paragraph.click(() =>{
                                if (input.text() == "Paragraph")
                                    input.text("")
                            })
                            completion.click(() =>{
                                input.text(input.text()+" "+completion.text())
                                completion.text("")
                                assign(quiz, ["sections", section.attr("id"), "questions", paragraph.closest("article").attr("id"), "elements", questionPartContainer.attr("id"), "content"], input.text())
                            })
                            input.blur(() =>{
                                assign(quiz, ["sections", section.attr("id"), "questions", paragraph.closest("article").attr("id"), "elements", questionPartContainer.attr("id"), "content"], input.text())
                            })
                            var editor = $("<div class='moquiz-editor'></div>")
                            var model = $("<select class='moquiz-dropdown'><option value='0'>j1-large(7.5B)</option><option value='1'>j1-jumbo(178B)</option></select>")
                            var generateTextAI21Labs = $("<button class='moquiz-button'>Generate Text</button>")
                            var maxTokens = $("<input class='moquiz-slider' type='range' min='1' max='1024' step='1' value='8'></input>") //createSlider("Max Tokens", 1, 2048, 1)
                            var temperature = $("<input class='moquiz-slider' type='range' min='0' max='5' step='0.01' value='1.7'></input>")
                            var topP = $("<input class='moquiz-slider' type='range' min='0.01' max='1' step='0.01' value='0.7'></input>")
                            var stopSequences = $("<input class='moquiz-text-input'></input>")
                            var apiKey = $("<input class='moquiz-text-input' type='password'></input>")
                            if(sessionStorage.getItem('AI21LabsApiKey'))
                                apiKey.val(sessionStorage.getItem('AI21LabsApiKey'))
                            generateTextAI21Labs.click(() =>{
                                input.text(input.text()+" "+completion.text())
                                completion.text("")
                                if(apiKey.val() == ""){
                                    alert("Please enter your AI21 Labs API Key")
                                }else{
                                    console.log(apiKey.val())
                                    console.log(input.text())
                                    $.ajax({
                                        method: 'POST', 
                                        beforeSend: (request) =>{
                                            request.setRequestHeader('Authorization', 'Bearer '+apiKey.val())
                                            request.setRequestHeader('Content-Type', 'application/json')
                                        },
                                        url: 'https://api.ai21.com/studio/v1/'+((model.val()==0)?'j1-large':'j1-jumbo')+'/complete', 
                                        data: JSON.stringify({
                                            'prompt': input.text(), 
                                            'temperature': temperature.val(), 
                                            'maxTokens': maxTokens.val(), 
                                            'topP': topP.val(), 
                                            'stopSequences': ['Q:']
                                        }), 
                                        success: (data) =>{
                                            console.log(data)
                                            sessionStorage.setItem('AI21LabsApiKey', apiKey.val())
                                            completion.text("")
                                            var text = data.completions[0].data.text
                                            console.log(text)
                                            completion.typewrite({
                                                showCursor: false, 
                                                speed: 50, 
                                                actions: [{
                                                    type: text
                                                }]
                                            })
                                            input.text(input.text()+" "+completion.text())
                                        }, 
                                        error: (error) =>{
                                            console.log(error)
                                        }, 
                                    })
                                }
                            })
                            editor.append(model, generateTextAI21Labs, maxTokens, temperature, topP, apiKey)
                            removeButton.click(() =>{
                                questionPartContainer.slideUp()
                                delete quiz["sections"][section.attr("id")]["questions"][container.attr("id")]["elements"][questionPartContainer.attr("id")]
                            })
                            paragraph.append(input, completion)
                            questionPartContainer.append(paragraph, editor, removeButton)
                            questionElementDragArea.append(questionPartContainer)
                            questionPartContainer.slideDown()
                            break

                        case "2":
                            questionPartContainer.empty()
                            var regexInput = $("<input id='regex-input-"+id+"'></input>").addClass("moquiz-regex-input")
                            var input = $("<p>Paragraph</p>").addClass("moquiz-paragraph").attr("contenteditable", "true")
                            var removeButton = $("<button>Remove</button>").addClass("moquiz-button")
                            input.click(() =>{
                                if (input.text() == "Paragraph") {
                                    input.text("")
                                }
                            })
                            input.blur(() =>{
                                assign(quiz, ['sections', section.attr('id'), 'questions', container.attr('id'), 'elements', questionPartContainer.attr('id'), 'content'], input.text())
                            })
                            removeButton.click(() =>{
                                questionPartContainer.slideUp()
                                delete quiz['sections'][section.attr('id')]['questions'][container.attr('id')]['elements'][questionPartContainer.attr('id')]['content']
                            })
                            regexInput.change(() =>{
                                var regex = new RegExp(regexInput.val(), "img")
                                input.html(input.text().replace(regex, "<input type='text'/>"))
                                if (regexInput.val() == "")
                                    input.html(input.text().replace("<input type='text'/>", ""))
                                assign(quiz, ['sections', section.attr('id'), 'questions', container.attr('id'), 'elements', questionPartContainer.attr('id'), 'regex'], regexInput.text())
                            })
                            questionPartContainer.append(regexInput, input, removeButton)
                            questionElementDragArea.append(questionPartContainer)
                            questionPartContainer.slideDown()
                            break

                        case "3":
                            questionPartContainer.empty()
                            var image = $("<img></img>").attr("alt", "Image").attr("src", "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png").addClass("moquiz-image")
                            var removeButton = $("<button>Remove</button>").addClass("moquiz-button")
                            var br = $("<br/>")
                            var editor = $("<div></div>").addClass("moquiz-editor")
                            var imageLink = $("<input placeholder='Paste Image Link Here'></input>").addClass("moquiz-text-input").css({width: "80%"})
                            var fetch = $("<button class='moquiz-button'>Fetch Image</button>")
                            fetch.click(() =>{
                                image.attr("src", imageLink.val())
                                assign(quiz, ['sections', section.attr('id'), 'questions', container.attr('id'), 'elements', questionPartContainer.attr('id'), 'url'], imageLink.val())
                            })
                            /*
                            
                            ####   ####  #####    #
                            #   #  #       #     # #
                            ####   ####    #    #   #
                            #   #  #       #    #####
                            ####   ####    #    #   #

                            var drivePicker = $("<button>Choose from Google Drive</button>")
                            drivePicker.click(() =>{
                                gapi.load('picker', () =>{
                                    var view = new google.picker.View(google.picker.ViewId.DOCS_IMAGES)
                                    var picker = new google.picker.PickerBuilder()
                                        .disableFeature(google.picker.Feature.NAV_HIDDEN)
                                        .disableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                                        .setAppId("416030417638")
                                        .setOAuthToken(gapi.auth.getToken().access_token)
                                        .addView(view)
                                        .addView(new google.picker.DocsUploadView())
                                        .setDeveloperKey("AIzaSyCvdZqmTvmb5PHekDyZD063cw-kmZsvYnU")
                                        .setCallback((data) =>{
                                            console.log(data)
                                        })
                                        .build()
                                    picker.setVisible(true)
                                })
                            })*/
                            removeButton.click(() =>{
                                questionPartContainer.slideUp()
                            })
                            editor.append(imageLink, fetch)
                            questionPartContainer.append(image, editor, br, removeButton)
                            questionElementDragArea.append(questionPartContainer)
                            questionPartContainer.slideDown()
                            break

                        case "4":
                            questionPartContainer.empty()
                            assign(quiz, ['sections', section.attr('id'), 'questions', container.attr('id'), 'elements', questionPartContainer.attr('id'), 'type'], 'math')
                            var input = $("<textarea></textarea>").addClass("moquiz-math-input")
                            
                            var mathOut = $("<div></div>").addClass("moquiz-math-display")
                            var removeButton = $("<button>Remove</button>").addClass("moquiz-button")
                            var block = false
                            var checkbox = $("<input class='moquiz-checkbox' type='checkbox'>Display as block</input>")
                            checkbox.click(() =>{
                                block = (block)? false:true
                                if(block)
                                    mathOut.html("$$"+input.val()+"$$")
                                else
                                    mathOut.html("\\("+input.val()+"\\)")
                                MathJax.typesetPromise()
                            });
                            input.on("input", () =>{
                                assign(quiz, ['sections', section.attr('id'), 'questions', container.attr('id'), 'elements', questionPartContainer.attr('id'), 'content'], input.val())
                                if(block)
                                    mathOut.html("$$"+input.val()+"$$")
                                else
                                    mathOut.html("\\("+input.val()+"\\)")
                                MathJax.typesetPromise()
                            })
                            removeButton.click(() =>{
                                questionPartContainer.slideUp()
                            })
                            questionPartContainer.append(input, checkbox, mathOut, removeButton)
                            questionElementDragArea.append(questionPartContainer)
                            questionPartContainer.slideDown()
                            break

                        case "5":
                            questionPartContainer.empty()
                            var addButton = $("<button>Add</button>").addClass("moquiz-button")
                            var paragraph = $("<div></div>").addClass("moquiz-sortable-container")
                            var removeButton = $("<button>Remove</button>").addClass("moquiz-button")
                            addButton.click(() =>{
                                var content = $("<p>Sortable Item</p>").attr("contenteditable", "true").addClass("moquiz-paragraph")
                                var item = $("<div></div>").addClass("moquiz-sortable-item")
                                var removeItem = $("<button>Remove</button>").addClass("moquiz-button")
                                content.click(() =>{
                                    if (content.text() == "Sortable Item")
                                        content.text("")
                                })
                                removeItem.click(() =>{
                                    item.slideUp()
                                })
                                item.append(content, removeItem)
                                paragraph.append(item)
                            })
                            removeButton.click(() =>{
                                paragraph.slideUp()
                            })
                            paragraph.sortable({cancel: '.moquiz-paragraph, .moquiz-button', 
                            axis: "y", 
                            helper: 'clone', 
                            revert: true, 
                            sctoll: true, 
                            connectWith: '.moquiz-interior-drag-area', 
                            dragOnEmpty: true})
                            paragraph.append(addButton, removeButton)
                            questionPartContainer.append(paragraph)
                            questionElementDragArea.append(questionPartContainer)
                            questionPartContainer.slideDown()
                            break

                        case "6":
                            questionPartContainer.empty()
                            assign(quiz, ['sections', section.attr('id'), 'questions', container.attr('id'), 'elements', questionPartContainer.attr('id'), 'type'], 'list')
                            var listItem = $("<div></div>").addClass("moquiz-listItem")
                            var input = $("<p>List Item</p>").attr("contenteditable", "true").addClass("moquiz-paragraph")
                            var removeButton = $("<button>Remove</button>").addClass("moquiz-button")
                            input.click(() =>{
                                if (input.text() == "List Item") {
                                    input.text("")
                                }
                            })
                            input.blur(() =>{
                                assign(quiz, ['sections', section.attr('id'), 'questions', container.attr('id'), 'elements', questionPartContainer.attr('id'), 'content'], input.text())
                            })
                            listItem.append(input)
                            removeButton.click(() =>{
                                questionPartContainer.slideUp()
                            })
                            questionPartContainer.append(listItem, removeButton)
                            questionElementDragArea.append(questionPartContainer)
                            questionPartContainer.hide()
                            questionPartContainer.slideDown()
                            break

                        case "7":
                            questionPartContainer.empty()
                            assign(quiz, ['sections', section.attr('id'), 'questions', container.attr('id'), 'elements', questionPartContainer.attr('id'), 'type'], 'code')
                            var codeEditor = $("<textarea>console.log(\"Hello World\");</textarea>").addClass("moquiz-code-editor").attr("id", "editor-"+id)
                            var outputContainer = $("<pre></pre>")
                            var codeOutput = $("<code></code>").addClass("moquiz-code-output")
                            outputContainer.append(codeOutput)
                            var removeButton = $("<button>Remove</button>")
                            removeButton.click(() =>{
                                questionPartContainer.slideUp()
                            })
                            questionPartContainer.append(codeEditor, outputContainer, removeButton)
                            questionElementDragArea.append(questionPartContainer)
                            questionPartContainer.hide()
                            questionPartContainer.slideDown()
                            hljs.highlightBlock(outputContainer.html(codeEditor.val()).get(0))
                            codeEditor.on("input", function(){
                                if (codeEditor.text() == ""){
                                    codeOutput.text(" ")
                                }
                                hljs.highlightBlock(outputContainer.html(codeEditor.val()).get(0))
                            })
                            codeEditor.on("focus", () =>{
                                document.getElementById('editor-'+id).addEventListener('keydown', function(e) {
                                    if (e.key == 'Tab') {
                                        e.preventDefault();
                                        var start = this.selectionStart
                                        var end = this.selectionEnd
                                        this.value = this.value.substring(0, start) +
                                            "\t" + this.value.substring(end)
                                        this.selectionStart = this.selectionEnd = start + 1
                                    }
                                })
                            })
                            break
                    }
                    questionType.blur()
                })
                questionElementDragArea.append(questionType)
                questionElementDragArea.sortable({cancel: cancelElements, 
                    axis: "y", 
                    helper: 'clone', 
                    revert: true, 
                    sctoll: true, 
                    connectWith: '.moquiz-interior-drag-area', 
                    dragOnEmpty: true})
                elementIt++
            })
            var answerDragArea = $("<div></div>").addClass("moquiz-answer-drag-area")
            var answerType = $("<select>"+"<option value='0' disabled selected>Select</option>"+"<option value='1'>Radio</option>"+"<option calue='2'>Checkbox</option>"+"<option value='3'>TextField</option>"+"<option value='4'>MultiFormat</option>"+"</select>").addClass("moquiz-dropdown")
            answerType.on("change", () =>{
                switch (answerType.find(":selected").val()) {
                    case "1":
                        var checkboxListContainer = $("<div></div>").addClass("moquiz-radio-button-list-container")
                        var checkboxDragArea = $("<div></div>").addClass("moquiz-radio-button-drag-area")
                        var removeButton = $("<button>Remove</button>").addClass("moquiz-button")
                        var addButton =$("<button>Add</button>").addClass("moquiz-button")
                        var id = 0
                        addButton.click(() =>{
                            var radioButton = $("<input type='radio' name='button-set-"+it+"' id='radio-button-"+id+"'/>").addClass("moquiz-radio-button")
                            var buttonLabel = $("<label for='radio-button-"+id+"'>Option</label>").addClass("moquiz-paragraph").attr("contenteditable", "true")
                            var removeRadio = $("<button>Remove</button>").addClass("moquiz-button")
                            var buttonContainer = $("<div></div>").addClass("moquiz-radio-button-container")
                            buttonLabel.click(() =>{
                                if (buttonLabel.text() == "Option") {
                                    buttonLabel.text("")
                                }
                            })
                            removeRadio.click(() =>{
                                buttonContainer.slideUp()
                            })
                            buttonContainer.append(radioButton, buttonLabel, removeRadio)
                            checkboxDragArea.append(buttonContainer)
                            checkboxDragArea.sortable({cancel: '.moquiz-paragraph, .moquiz-radio-button', 
                            axis: "y", 
                            helper: 'clone', 
                            revert: true, 
                            sctoll: true, 
                            dragOnEmpty: true})
                            checkboxListContainer.append(checkboxDragArea)
                        })
                        removeButton.click(() =>{
                            checkboxListContainer.slideUp()
                            answerType.val(0)
                        })
                        checkboxListContainer.append(addButton, removeButton)
                        answerDragArea.append(checkboxListContainer)
                        break

                    case "2":
                        var checkboxListContainer = $("<div></div>").addClass("moquiz-checkbox-list-container")
                        var checkboxDragArea = $("<div></div>").addClass("moquiz-checkbox-drag-area")
                        var removeButton = $("<button>Remove</button>").addClass("moquiz-button")
                        var addButton =$("<button>Add</button>").addClass("moquiz-button")
                        var id = 0
                        addButton.click(() =>{
                            var checkbox = $("<input type='checkbox' name='checkbox-set-"+it+"' id='checkbox-"+id+"'/>").addClass("moquiz-checkbox")
                            var checkboxLabel = $("<label for='checkbox-"+id+"'>Option</label>").addClass("moquiz-paragraph").attr("contenteditable", "true")
                            var removeCheckbox = $("<button>Remove</button>").addClass("moquiz-button")
                            var checkboxContainer = $("<div></div>").addClass("moquiz-checkbox-container")
                            checkboxLabel.click(() =>{
                                if (checkboxLabel.text() == "Option") {
                                    checkboxLabel.text("")
                                }
                            })
                            removeCheckbox.click(() =>{
                                checkboxContainer.slideUp()
                            })
                            checkboxContainer.append(checkbox, checkboxLabel, removeCheckbox)
                            checkboxDragArea.append(checkboxContainer)
                            checkboxDragArea.sortable({cancel: '.moquiz-paragraph, .moquiz-checkbox', 
                            axis: "y", 
                            helper: 'clone', 
                            revert: true, 
                            sctoll: true, 
                            dragOnEmpty: true})
                            checkboxListContainer.append(checkboxDragArea)
                        })
                        removeButton.click(() =>{
                            checkboxListContainer.slideUp()
                            answerType.val(0)
                        })
                        checkboxListContainer.append(addButton, removeButton)
                        answerDragArea.append(checkboxListContainer)
                        break

                    case "3":
                        var textArea = $("<input type='text' id='text-field-"+it+"'></input>").addClass("moquiz-text-field")
                        var removeButton = $("<button>Remove</button>").addClass("moquiz-button")
                        var textFieldContainer = $("<div></div>").addClass("moquiz-text-field-container")
                        removeButton.click(() =>{
                            textFieldContainer.slideUp()
                            answerType.val(0)
                        })
                        textFieldContainer.append(textArea, removeButton)
                        answerDragArea.append(textFieldContainer)
                        break

                    case "4":
                        var textArea = $("<textarea id='text-field-"+it+"'></textarea>").addClass("moquiz-text-area")
                        var removeButton = $("<button>Remove</button>").addClass("moquiz-button")
                        var textFieldContainer = $("<div></div>").addClass("moquiz-text-field-container")
                        removeButton.click(() =>{
                            textFieldContainer.slideUp()
                            answerType.val(0)
                        });
                        textFieldContainer.append(textArea, removeButton)
                        answerDragArea.append(textFieldContainer)
                        break
                }
            })
            answerDragArea.append(answerType)
            questionContainer.append(questionElementDragArea)
            var removeButton = $("<button class='moquiz-button'>Remove Question</button>")
            removeButton.click(() =>{
                container.slideUp()
                delete quiz["sections"][section.attr("id")]["questions"][container.attr("id")]
            })
            var br = $("<br/>")
            container.append(questionContainer, answerDragArea, br, removeButton)
            questionDragArea.sortable({cancel: cancelElements, 
                axis: "y", 
                helper: 'clone', 
                revert: true, 
                sctoll: true, 
                connectWith: '.moquiz-drag-area', 
                dragOnEmpty: true})
            questionDragArea.append(container)
            questionIt++
        })
        var removebutton = $("<button>Remove Section</button>").addClass("moquiz-button")
        section.append(removebutton);
        removebutton.click(() =>{
            section.slideUp()
            delete quiz["sections"][section.attr("id")]
        })
        sectionDragArea.sortable({cancel: cancelElements, 
            axis: "y", 
        helper: 'clone', 
        revert: true, 
        sctoll: true})
        section.append(questionDragArea)
        sectionDragArea.append(section)
        sectionIt++
    })
    var saved = (url.has('fid'))? true:false
    console.log(saved)
    if(saved){
        profile.then(() =>{
            $.ajax({
                method:'GET', 
                beforeSend:(request) =>{
                    request.setRequestHeader('Authorization', 'Bearer '+gapi.auth.getToken().access_token)
                    request.setRequestHeader('Content-Type', 'application/json')
                }, 
                url:'https://www.googleapis.com/drive/v3/files/'+url.get('fid')+'/?alt=media', 
                success:(data) =>{
                    console.log(data)
                    console.log(JSON.stringify(data, null, '\t'))
                    title.text(data.title)
                    description.text(data.description)
                    for (const section in data.sections){
                        addSectionButton.trigger("click")
                        $('section').last().attr('id', section)
                        $('section').last().children('h2').text(data.sections[section].title)
                        console.log('changed title')
                        for (const question in data.sections[section].questions){
                            $('#'+section).children('button').first().trigger('click')
                            $('#'+section).children('article').last().attr('id', question)
                            $('#'+question).children('header').children('h3').text(data.sections[section].questions[question].title)
                            console.log('changed title')
                            for (const element in data.sections[section].questions[question].elements){
                                var type = data.sections[section].questions[question].elements[element].type
                                var val = (type=='paragraph')? 1:(type='fillups')? 2:(type=='image')? 3:(type=='math')? 4:(type=='sortable')? 5:(type=='list')? 6:7
                                $('#'+section).children('div').last().children('#'+question).children('header').children('button').first().trigger('click')
                                $('#'+section).children('div').last().children('#'+question).children('header').children('div').last().children('select').last().val(val)
                                $('#'+section).children('div').last().children('#'+question).children('header').children('div').last().children('select').last().trigger('change')
                                if (val == 1){
                                    $('#'+section).children('div').last().children('#'+question).children('header').children('div').last().children('div').last().children('div').first().children('span').first().text(data.sections[section].questions[question].elements[element].content)
                                }
                                console.log('selected type')
                            }
                        }
                    }
                }, 
                error:(error) =>{
                    console.log(error)
                    saved = false
                }
            })
        })
    }
    saveButton.click(() =>{
        var data = JSON.stringify(quiz, null, '\t')
        console.log(data)
        var fileMetadata = {
            'name': quiz.name+'.json'
        }
        if(!saved){
            var prompt = $("<div id='save-file-input'></div>")
            var input = $("<input class='moquiz-text-input' placeholder='Enter File Name' value='New Quiz'></input>")
            var save = $("<button class='moquiz-button'>Save</button>")
            var cancel = $("<button class='moquiz-button no-rec'>Cancel</button>")
            var bg = $("<div id='save-file-input-bg'><div>")
            input.on('input', () =>{
                if (input.val() == ''||input.val() == null){
                    save.attr('disabled', 'true')
                    save.addClass('no-rec')
                }else{
                    save.removeAttr('disabled')
                    save.removeClass('no-rec')
                }
            })
            save.click(() =>{
                saveButton.attr("disabled", "true")
                quiz.name = input.val()
                var data = JSON.stringify(quiz, null, '\t')
                console.log(data)
                var fileMetadata = {
                    'name': input.val()+'.json'
                }
                const form = new FormData()
                form.append('metadata', new Blob([JSON.stringify(fileMetadata)], {type: 'application/json'}))
                form.append('file', new Blob([data], {type: 'application/json'}))
                fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
                    method: 'POST',
                    headers: new Headers({'Authorization': 'Bearer ' + gapi.auth.getToken().access_token}),
                    body: form
                })
                .then((res) => res.json())
                .then((res) =>{
                    console.log(res)
                    var data = {
                        role:'writer', 
                        type:'anyone'
                    }
                    $.ajax({
                        method:'POST', 
                        beforeSend:(request) =>{
                            request.setRequestHeader('Authorization', 'Bearer '+gapi.auth.getToken().access_token)
                        }, 
                        url:'https://www.googleapis.com/drive/v2/files/'+res.id+'/permissions', 
                        data: data, 
                        success:(response) =>{
                            saveButton.removeAttr("disabled")
                            console.log(response)
                            saved = true
                        },
                        error:(error) =>{
                            saveButton.removeAttr("disabled")
                            console.log(error)
                        }
                    })
                })
                cancel.trigger("click")
            })
            cancel.click(() =>{
                saveButton.removeAttr("disabled")
                bg.remove()
                prompt.remove()
            })
            bg.click(() =>{
                cancel.trigger("click")
            })
            prompt.append(input, save, cancel)
            body.append(bg, prompt)
            input[0].select()
        }else{
            const form = new FormData()
            form.append('metadata', new Blob([JSON.stringify(fileMetadata)], {type: 'application/json'}))
            form.append('file', new Blob([data], {type: 'application/json'}))
            fetch('https://www.googleapis.com/upload/drive/v3/files/'+url.get('fid')+'?uploadType=multipart', {
                method: 'PATCH',
                headers: new Headers({'Authorization': 'Bearer ' + gapi.auth.getToken().access_token}),
                body: form
            })
            .then((res) => console.log(res))
        }
    })
    /*$("html").mouseleave(() =>{
        saveButton.trigger("click")
    })*/
    topSection.append(title, description, addSectionButton, sectionDragArea)
    body.append(saveButton, signOutButton, topSection)
}