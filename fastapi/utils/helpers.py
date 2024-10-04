import re

def separate_lyrics_and_chords(text, chords):
    lines = text.strip().split('\n')
    result = []
    for line in lines:
        if "INTRO" in line or "INSTRU" in line:
            result.append({
                'text': line.strip(),
                'chords': '',
                'rest_text': ''
            })
        elif any(chord in line for chord in chords):
            for chord in chords:
                if chord in line:
                    parts = line.split(chord)
                    resultText = parts[0].strip()
                    restText = parts[1].strip()
                    result.append({
                        'text': resultText,
                        'chords': chord,
                        'rest_text': restText
                    })
                    break
        else:
            result.append({
                'text': line.strip(),
                'chords': '',
                'resttext': ''
            })

    return result

def replace_chords_with_underscore(text, chords):
    # Sort chords by length in descending order to match longer chords first
    # text = text.replace("\n", "")
    text = text.strip()
    chords_sorted = sorted(chords, key=len, reverse=True)
    
    # Create a regex pattern that matches any chord, including those with '#'
    chord_pattern = '|'.join(re.escape(chord) for chord in chords_sorted)
    
    found_chords = []
    
    def replace_match(match):
        found_chords.append(match.group(0))
        return '_'
    # Use re.sub with the chord pattern
    replaced_text = re.sub(chord_pattern, replace_match, text)
    
    return {
        'text': replaced_text,
        'chords': found_chords
    }
    