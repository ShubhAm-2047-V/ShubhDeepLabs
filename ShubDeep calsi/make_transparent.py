from PIL import Image

def make_transparent():
    # Load image and convert to RGBA
    img = Image.open(r"e:\shubdeeplabs\ShubDeep calsi\assets\logo.jpg").convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Calculate luminance (brightness) of the pixel
        # Standard luminance formula: 0.299*R + 0.587*G + 0.114*B
        lum = 0.299 * item[0] + 0.587 * item[1] + 0.114 * item[2]
        
        # If the pixel is bright (like the beige background), make it transparent
        # 220 is a good threshold for light beige/white
        if lum > 220:
            newData.append((255, 255, 255, 0)) # Fully transparent
        else:
            newData.append((item[0], item[1], item[2], 255)) # Keep original opaque pixel

    img.putdata(newData)
    img.save(r"e:\shubdeeplabs\ShubDeep calsi\assets\logo_transparent.png", "PNG")

if __name__ == "__main__":
    make_transparent()
    print("Successfully created transparent logo!")
