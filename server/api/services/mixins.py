class DictionaryMixin:
    id: int

    def to_dict(self):
        raise NotImplementedError()
