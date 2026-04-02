import os

def generate_tree(dir_path, prefix=''):
    contents = sorted([d for d in os.listdir(dir_path) if d not in ['.git', 'node_modules', 'dist']])
    lines = []
    for i, name in enumerate(contents):
        path = os.path.join(dir_path, name)
        is_last = (i == len(contents) - 1)
        lines.append(prefix + ('\-- ' if is_last else '|-- ') + name)
        if os.path.isdir(path):
            lines.extend(generate_tree(path, prefix + ('    ' if is_last else '|   ')))
    return lines

with open('final_tree.txt', 'w', encoding='utf-8') as f:
    f.write('pocc\n' + '\n'.join(generate_tree('.')))
