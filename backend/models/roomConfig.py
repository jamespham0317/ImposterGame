class roomConfig:
    def __init__(self):
        self.difficulty_range = ['easy', 'medium', 'hard']  # fix: use consistent name
        self.master_timer = 900

    def set_difficulty_range(self, levels: list):
        valid = {'easy', 'medium', 'hard'}
        filtered = [l for l in levels if l in valid]
        if filtered:
            self.difficulty_range = filtered  # now matches __init__
        else:
            self.difficulty_range = ['easy', 'medium', 'hard']