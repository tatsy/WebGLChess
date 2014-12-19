#-*- coding: utf-8 -*-
import os
import sys
import re

def save_json_rec(fp, data, tab):
    datalen = len(data)
    for i, (key, value) in enumerate(data.items()):
        if isinstance(value, dict):
            fp.write('%s"%s": {\n' % (tab, key))
            save_json_rec(fp, value, tab + '    ')
            fp.write(tab + ' },\n')
        else:
            fp.write('%s"%s": %s%s' % (tab, key, value, ",\n" if i != datalen-1 else "\n"))

def save_json(path, data):
    with open(path, 'w') as fp:
        fp.write('{ \n')
        save_json_rec(fp, data, '    ')
        fp.write('} \n')

def obj2json(path):
    base, ext = os.path.splitext(path)
    outfile = base + ".js"

    data = {}
    data['metadata']  = {}
    data['vertices']  = []
    data['normals']   = []
    data['faces']     = []
    data['colors']    = []
    data['uvs']       = [[]]
    data['materials'] = []
    data['scale']     = 1.0;

    with open(path, 'r') as fp:
        vertices = []
        normals  = []
        faces    = []
        for line in fp:
            line = line.strip()
            if line.startswith('#'):
                continue
            if len(line) == 0:
                continue

            items = re.split('\s+', line)
            if items[0] == 'v':
                vertices.extend([float(items[1]), float(items[2]), float(items[3])])
            elif items[0] == 'vn':
                normals.extend([float(items[1]), float(items[2]), float(items[3])])
            elif items[0] == 'f':
                if len(items) > 4:
                    raise Exception('Non-triangle mesh detected !!')
                ff = []
                nn = []
                for i in range(3):
                    f,c,n = items[i+1].split('/')
                    ff.append(int(f)-1)
                    nn.append(int(n)-1)
                faces.append(34)
                faces.extend(ff)
                faces.append(0)
                faces.extend(nn)

        # normalize vertex position
        min_z = 1.0e20
        center_xy = [0.0, 0.0]
        for i in range(len(vertices) // 3):
            center_xy[0] += vertices[i*3+0]
            center_xy[1] += vertices[i*3+2]
            min_z = min(min_z, vertices[i*3+1])
        center_xy[0] /= len(vertices) // 3
        center_xy[1] /= len(vertices) // 3
        for i in range(len(vertices) // 3):
            vertices[i*3+0] -= center_xy[0]
            vertices[i*3+2] -= center_xy[1]
            vertices[i*3+1] -= min_z

        data['metadata'] = {
            'formatVersion': 3,
            'vertices': len(vertices) // 3,
            'faces': len(faces) // 8,
            'normals': len(normals) // 3,
            'colors': 0,
            'uvs': 0,
            'materials': 0,
        }

        data['vertices'] = vertices
        data['faces'] = faces
        data['normals'] = normals

        save_json(outfile, data)

if __name__ == '__main__':
    if len(sys.argv) <= 1:
        print('usage: python off2json.py [obj file]')
    else:
        obj2json(sys.argv[1])
