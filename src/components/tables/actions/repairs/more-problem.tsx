import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

const MoreProblem = ({ problems }: { problems: string[] }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-md">
          ...
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>维修故障</DialogTitle>
        </DialogHeader>
        {problems.map((problem) => (
          <Badge variant="outline" key={problem} className="rounded-md">
            {problem}
          </Badge>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default MoreProblem;
