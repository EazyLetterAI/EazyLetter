import os.path
import re
import numpy as np
from gensim import downloader
from gensim.models import Word2Vec
import pickle
import torch

from torch.optim import Adam

from LSTM import DependencyParser, DependencyDataSet, train, cposTable


def preprocess(path, w2i):
    sentence_index = 0
    list_of_sentences_with_tags = []
    sentence = []
    with open(path, encoding='utf-8') as f:
        for line in f:
            if line == "\n":
                sentence_index += 1
                list_of_sentences_with_tags.append(sentence)
                sentence = []
                continue
            if line[-1:] == "\n":
                line = line[:-1]
            line_set = re.split(r'\t+', line)
            # print(line_set)
            tag = line_set[6] if line_set[6] != '_' else -1
            word_index = line_set[0]
            word = line_set[1]
            word_pos = line_set[3]
            X_representation = np.array([int(word_index), w2i[word], cposTable.index(word_pos), int(tag)])
            sentence.append(X_representation)
    list_of_sentences_with_tags = [np.array(sen).T for sen in list_of_sentences_with_tags]
    return list_of_sentences_with_tags


def create_data(train_path, test_path, com_path, w2i):
    list_of_sentences_with_tags_train = preprocess(train_path, w2i)
    with open(f"train.data", 'wb+') as f:
        pickle.dump(list_of_sentences_with_tags_train, f)

    list_of_sentences_with_tags_test = preprocess(test_path, w2i)
    with open(f"test.data", 'wb+') as f:
        pickle.dump(list_of_sentences_with_tags_test, f)

    list_of_sentences_comp = preprocess(com_path, w2i)
    with open(f"comp.data", 'wb+') as f:
        pickle.dump(list_of_sentences_comp, f)


def create_w2i_i2w():
    with open(f"train.data", 'rb') as f:
        list_of_sentences_with_tags_train = pickle.load(f)
    with open(f"test.data", 'rb') as f:
        list_of_sentences_with_tags_test = pickle.load(f)
    with open(f"comp.data", 'rb') as f:
        list_of_sentences_with_tags_comp = pickle.load(f)
    words = [sen[1] for sen in list_of_sentences_with_tags_train] + [sen[1] for sen in
                                                                     list_of_sentences_with_tags_test] + [sen[1] for sen
                                                                                                          in
                                                                                                          list_of_sentences_with_tags_comp]
    words = list(set(np.concatenate(words).tolist()))
    w2i = {k: v for v, k in enumerate(words)}
    i2w = {v: k for v, k in enumerate(words)}
    with open(f"w2i.dict", 'wb+') as f:
        pickle.dump(w2i, f)
    with open(f"i2w.dict", 'wb+') as f:
        pickle.dump(i2w, f)


def pre_embedding():
    #WORD_2_VEC_PATH = 'word2vec-google-news-300'
    #google_model = downloader.load(WORD_2_VEC_PATH)
    #google_model.save("google_word2vec.model")

    with open(f"train.data", 'rb') as f:
        list_of_sentences_with_tags_train = pickle.load(f)
    with open(f"test.data", 'rb') as f:
        list_of_sentences_with_tags_test = pickle.load(f)
    with open(f"comp.data", 'rb') as f:
        list_of_sentences_with_tags_comp = pickle.load(f)
    sentences = [sen[1] for sen in (
            list_of_sentences_with_tags_train + list_of_sentences_with_tags_test + list_of_sentences_with_tags_comp)]
    trained_model = Word2Vec(sentences=sentences, vector_size=100, window=2, min_count=1, workers=4, epochs=100,
                             seed=42)
    trained_model.save("trained_word2vec.model")



if __name__ == '__main__':

    # # Preprocess the data files
    train_path = f'train.labeled'
    test_path = f'test.labeled'
    com_path = f'comp.unlabeled'
    #create_data(train_path, test_path, com_path, w2i)

    # # Create the embedding models
    pre_embedding()

    # # Create w2i and i2w dicts
    #create_w2i_i2w()
    with open(f"w2i.dict", 'rb') as f:
        w2i = pickle.load(f)
    with open(f"i2w.dict", 'rb') as f:
        i2w = pickle.load(f)
    # test model
    train_ds = DependencyDataSet(f"train.data")
    test_ds = DependencyDataSet(f"test.data")
    datasets = {"train": train_ds, "test": test_ds}
    #
    hp = dict(num_epochs=100, hidden_dim=125, hidden_dim2=100, alpha=0.25, lr=0.1)
    model = DependencyParser(hidden_dim=hp['hidden_dim'], hidden_dim2=hp['hidden_dim2'], alpha=hp['alpha'], i2w=i2w)
    optimizer = Adam(params=model.parameters(), lr=hp['lr'])
    best_uas = train(model=model, data_sets=datasets, optimizer=optimizer, num_epochs=hp['num_epochs'], hp=hp)
